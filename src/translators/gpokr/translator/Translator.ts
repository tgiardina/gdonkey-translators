import { ActionType, BlindSize } from "../../../enums";
import { Card, Curator } from "../../../interfaces";
import { GameEvent, GameEventId, gameEvent } from "../types";

function translateCard(card: { rank: number; suit: number }): Card {
  return {
    rank: card.rank,
    suit: card.suit,
  };
}

export default class Translator {
  constructor(private curator: Curator) {}

  public translate(event: GameEvent): void {
    if (!event) return;
    const id = event.typeName;
    if (id === GameEventId.Init) {
      this.curator.startNewProject();
      this.translatePlayers(<gameEvent.Init>event);
    } else if (id === GameEventId.Start) {
      this.curator.startNewGame();
      this.translateGameId(<gameEvent.Start>event);
      this.translateButton(<gameEvent.Start>event);
      this.translateStacks(<gameEvent.Start>event);
      this.translateBlinds(<gameEvent.Start>event);
      this.curator.arrangeGame();
    } else if (id === GameEventId.Sit) {
      this.translateSit(<gameEvent.Sit>event);
    } else if (id === GameEventId.Pocket) {
      this.translatePocket(<gameEvent.Pocket>event);
    } else if (id === GameEventId.BetRaise) {
      this.translateBetRaise(<gameEvent.BetRaise>event);
    } else if (id === GameEventId.CheckCall) {
      this.translateCheckCall(<gameEvent.CheckCall>event);
    } else if (id === GameEventId.Fold) {
      this.translateFold(<gameEvent.Fold>event);
    } else if (id === GameEventId.Flop) {
      this.translateFlop(<gameEvent.Flop>event);
    } else if (id === GameEventId.Turn) {
      this.translateTurnRiver(<gameEvent.River>event);
    } else if (id === GameEventId.River) {
      this.translateTurnRiver(<gameEvent.River>event);
    } else if (id === GameEventId.Showdown) {
      this.translateShowdown(<gameEvent.Showdown>event);
    } else if (id === GameEventId.End) {
      this.curator.exhibitGame();
    }
  }

  private translateBetRaise(event: gameEvent.BetRaise): void {
    this.curator.recordAction(event.seat, ActionType.BetRaise, event.amount);
  }

  private translateBlinds(event: gameEvent.Start): void {
    this.curator.identifyBlind(BlindSize.Small, event.smallblind);
    this.curator.identifyBlind(BlindSize.Big, event.bigblind);
  }

  private translateButton(event: gameEvent.Start): void {
    this.curator.identifyButton(event.dealer);
  }

  private translateCheckCall(event: gameEvent.CheckCall): void {
    this.curator.recordAction(event.seat, ActionType.CheckCall);
  }

  private translateFlop(event: gameEvent.Flop): void {
    const cards = [event.card1, event.card2, event.card3].map(translateCard);
    this.curator.collectBoard(...cards);
  }

  private translateFold(event: gameEvent.Fold): void {
    this.curator.recordAction(event.seat, ActionType.Fold);
  }

  private translateGameId(event: gameEvent.Start): void {
    this.curator.identifyGame(event.gameId.toString());
  }

  private translatePlayers(event: gameEvent.Init): void {
    event.table.gameInfo.playerInfo.forEach((player, seat) => {
      if (!player) return;
      this.curator.identifyPlayer(seat, player.user.name);
      if (player.forceBlind) this.curator.activateMissedBlind(seat);
    });
  }

  private translatePocket(event: gameEvent.Pocket): void {
    const cards = [event.card1, event.card2].map(translateCard);
    this.curator.recordPocket(event.seat, cards[0], cards[1]);
  }

  private translateShowdown(event: gameEvent.Showdown): void {
    const cards = [event.card1, event.card2].map(translateCard);
    this.curator.recordPocket(event.seat, cards[0], cards[1]);
  }

  private translateSit(event: gameEvent.Sit): void {
    this.curator.identifyPlayer(event.player.seat, event.player.user.name);
    this.curator.activateMissedBlind(event.player.seat);
  }

  private translateStacks(event: gameEvent.Start): void {
    event.chips.forEach((stack, seat) => {
      if (stack) {
        this.curator.identifyStack(seat, event.chips[seat]);
        this.curator.activateSeat(seat);
      }
    });
  }

  private translateTurnRiver(event: gameEvent.Turn): void {
    this.curator.collectBoard(translateCard(event.card1));
  }
}
