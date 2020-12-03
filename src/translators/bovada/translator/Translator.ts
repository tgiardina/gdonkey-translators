import { ActionType, BlindSize, BlindType } from "../../../enums";
import { Card, Curator } from "../../../interfaces";
import { GameEvent, GameEventId, gameEvent } from "../types";

const translateCard = (card: number): Card => ({
  rank: (card + 12) % 13,
  suit: Math.floor(card / 13),
});

const translateSeat = (seat: number): number => seat - 1;

export default class Translator {
  constructor(private curator: Curator) {}

  public translate(event: GameEvent): void {
    if (!event) return;
    const id = event.pid;
    if (id === GameEventId.GameType) {
      this.curator.startNewProject();
      this.initPlayers();
      this.translateGameType(<gameEvent.GameType>event);
    } else if (id === GameEventId.Start) {
      this.translateStart(<gameEvent.Start>event);
    } else if (id === GameEventId.GameId) {
      this.translateGameId(<gameEvent.GameId>event);
    } else if (id === GameEventId.Sit) {
      this.translateSit(<gameEvent.Sit>event);
    } else if (id === GameEventId.Stack) {
      this.translateStack(<gameEvent.Stack>event);
    } else if (id === GameEventId.Button) {
      this.translateButton(<gameEvent.Button>event);
    } else if (id === GameEventId.Blind) {
      this.translateBlind(<gameEvent.Blind>event);
    } else if (id === GameEventId.Pockets) {
      this.translatePockets(<gameEvent.Pockets>event);
      this.translateActiveSeats(<gameEvent.Pockets>event);
      this.curator.arrangeGame();
    } else if (id === GameEventId.Action) {
      this.translateAction(<gameEvent.Action>event);
    } else if (id === GameEventId.Flop) {
      this.translateFlop(<gameEvent.Flop>event);
    } else if (id === GameEventId.TurnRiver) {
      this.translateTurnRiver(<gameEvent.TurnRiver>event);
    } else if (id === GameEventId.Pocket) {
      this.translatePocket(<gameEvent.Pocket>event);
    } else if (id === GameEventId.FinalStacks) {
      this.curator.exhibitGame();
      this.translateStacks(<gameEvent.FinalStacks>event);
    }
  }

  private initPlayers(): void {
    for (let seat = 0; seat < 9; seat++) {
      this.curator.identifyPlayer(seat);
    }
  }

  private translateAction(event: gameEvent.Action): void {
    const type =
      event.btn === 1024
        ? ActionType.Fold
        : [64, 256].includes(event.btn)
        ? ActionType.CheckCall
        : ActionType.BetRaise;
    if (type === ActionType.BetRaise) {
      const amount = event.raise || event.bet;
      this.curator.recordAction(translateSeat(event.seat), type, amount);
    } else {
      this.curator.recordAction(translateSeat(event.seat), type);
    }
  }

  private translateActiveSeats(event: gameEvent.Pockets): void {
    for (const prop in event) {
      if (prop.slice(0, 4) === "seat") {
        const seat = translateSeat(parseInt(prop[4]));
        this.curator.activateSeat(seat);
      }
    }
  }

  private translateBlind(event: gameEvent.Blind): void {
    this.curator.recordBlind(
      translateSeat(event.seat),
      BlindType.PostBlind,
      event.bet
    );
    if (event.dead)
      this.curator.recordBlind(
        translateSeat(event.seat),
        BlindType.Donate,
        event.dead
      );
  }

  private translateButton(event: gameEvent.Button): void {
    this.curator.identifyButton(translateSeat(event.seat));
  }

  private translateFlop(event: gameEvent.Flop): void {
    this.curator.collectBoard(...event.bcard.map(translateCard));
  }

  private translateGameId(event: gameEvent.GameId): void {
    this.curator.identifyGame(event.stageNo);
  }

  private translateGameType(event: gameEvent.GameType): void {
    this.curator.identifyBlind(BlindSize.Big, event.bblind);
    this.curator.identifyBlind(BlindSize.Small, event.sblind);
  }

  private translatePocket(event: gameEvent.Pocket): void {
    const cards = event.card.map(translateCard);
    this.curator.recordPocket(translateSeat(event.seat), cards[0], cards[1]);
  }

  private translatePockets(event: gameEvent.Pockets): void {
    for (const prop in event) {
      if (prop.slice(0, 4) === "seat") {
        const seat = translateSeat(parseInt(prop[4]));
        const pocket = <[number, number]>event[prop];
        if (pocket[0] < 52)
          this.curator.recordPocket(
            seat,
            translateCard(pocket[0]),
            translateCard(pocket[1])
          );
      }
    }
  }

  private translateSit(event: gameEvent.Sit): void {
    if (event.type) {
      const seat = translateSeat(event.seat);
      this.curator.identifyPlayer(seat);
      this.curator.identifyStack(seat, event.account);
      if (event.nickName.length) this.curator.identifyUser(seat);
    }
  }

  private translateStack(event: gameEvent.Stack): void {
    this.curator.identifyStack(translateSeat(event.seat), event.cash);
  }

  private translateStacks(event: gameEvent.FinalStacks): void {
    event.account.map((stack, index) => {
      if (stack) this.curator.identifyStack(index, stack);
    });
  }

  private translateStart(event: gameEvent.Start): void {
    if (event.tableState === 2) this.curator.startNewGame();
  }

  private translateTurnRiver(event: gameEvent.TurnRiver): void {
    this.curator.collectBoard(translateCard(event.card));
  }
}
