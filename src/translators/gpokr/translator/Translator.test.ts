import { ActionType, BlindSize } from "../../../enums";
import { mockCurator } from "../../utils";
import Translator from "./";
import { GameEvent, GameEventId } from "../types";

const translator = new Translator(mockCurator);

describe("translate function", () => {
  beforeEach(jest.clearAllMocks);

  it("should ignore undefined input", () => {
    translator.translate(<GameEvent>(<unknown>undefined));
    Object.values(mockCurator).forEach((mock) =>
      expect(mock).not.toHaveBeenCalled()
    );
  });

  it("should ignore unrelated events", () => {
    translator.translate({
      typeName: <GameEventId>"ChatEvent",
    });
    Object.values(mockCurator).forEach((mock) =>
      expect(mock).not.toHaveBeenCalled()
    );
  });

  it("should translate init correctly", () => {
    const initObject = {
      table: {
        gameInfo: {
          playerInfo: [
            {
              forceBlind: false,
              user: {
                name: "PlayerA",
              },
            },
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            {
              forceBlind: true,
              user: {
                name: "PlayerB",
              },
            },
          ],
        },
      },
    };
    translator.translate({
      ...initObject,
      typeName: <GameEventId>"TableUpdateEvent",
    });
    expect(mockCurator.startNewProject).toBeCalledTimes(1);
    expect(mockCurator.identifyPlayer).toBeCalledTimes(2);
    expect(mockCurator.identifyPlayer).toBeCalledWith(0, "PlayerA");
    expect(mockCurator.identifyPlayer).toBeCalledWith(8, "PlayerB");
    expect(mockCurator.activateMissedBlind).toBeCalledTimes(1);
    expect(mockCurator.activateMissedBlind).toBeCalledWith(8);
  });

  it("should translate Start correctly", () => {
    const gameObject = {
      smallblind: 25,
      bigblind: 50,
      chips: [1500, 0, 0, 0, 0, 5000, 0, 0, 0],
      dealer: 5,
      gameId: 200,
    };
    translator.translate({
      ...gameObject,
      typeName: <GameEventId>"StartHandEvent",
    });
    expect(mockCurator.startNewGame).toBeCalledTimes(1);
    expect(mockCurator.identifyGame).toBeCalledTimes(1);
    expect(mockCurator.identifyGame).toBeCalledWith(
      gameObject.gameId.toString()
    );
    expect(mockCurator.identifyButton).toBeCalledTimes(1);
    expect(mockCurator.identifyButton).toBeCalledWith(gameObject.dealer);
    expect(mockCurator.identifyStack).toBeCalledTimes(2);
    expect(mockCurator.identifyStack).toBeCalledWith(0, gameObject.chips[0]);
    expect(mockCurator.identifyStack).toBeCalledWith(5, gameObject.chips[5]);
    expect(mockCurator.activateSeat).toBeCalledTimes(2);
    expect(mockCurator.activateSeat).toBeCalledWith(0);
    expect(mockCurator.activateSeat).toBeCalledWith(5);
    expect(mockCurator.identifyBlind).toBeCalledTimes(2);
    expect(mockCurator.identifyBlind).toBeCalledWith(
      BlindSize.Small,
      gameObject.smallblind
    );
    expect(mockCurator.identifyBlind).toBeCalledWith(
      BlindSize.Big,
      gameObject.bigblind
    );
  });

  it("should translate Sit correctly", () => {
    const player = {
      seat: 1,
      user: {
        name: "PlayerA",
      },
    };
    translator.translate({
      player,
      typeName: <GameEventId>"SitDownEvent",
    });
    expect(mockCurator.identifyPlayer).toBeCalledTimes(1);
    expect(mockCurator.identifyPlayer).toBeCalledWith(
      player.seat,
      player.user.name
    );
    expect(mockCurator.activateMissedBlind).toBeCalledTimes(1);
    expect(mockCurator.activateMissedBlind).toBeCalledWith(1);
  });

  it("should translate Pocket correctly", () => {
    const pocket = {
      seat: 7,
      cards: [
        { suit: 0, rank: 9 },
        { suit: 2, rank: 5 },
      ],
    };
    translator.translate({
      seat: pocket.seat,
      card1: pocket.cards[0],
      card2: pocket.cards[1],
      typeName: <GameEventId>"PocketCardsEvent",
    });
    expect(mockCurator.recordPocket).toBeCalledTimes(1);
    expect(mockCurator.recordPocket).toBeCalledWith(
      pocket.seat,
      ...pocket.cards.map((card) => ({ suit: card.suit, rank: card.rank }))
    );
  });

  it("should translate BetRaise correctly", () => {
    const bet = { amount: 50, seat: 8 };
    translator.translate({
      ...bet,
      typeName: <GameEventId>"BetRaiseEvent",
    });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(
      bet.seat,
      ActionType.BetRaise,
      bet.amount
    );
  });

  it("should translate CheckCall correctly", () => {
    const check = { seat: 6 };
    translator.translate({ ...check, typeName: <GameEventId>"CheckCallEvent" });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(
      check.seat,
      ActionType.CheckCall
    );
  });

  it("should translate Fold correctly", () => {
    const fold = { seat: 6 };
    translator.translate({ ...fold, typeName: <GameEventId>"FoldEvent" });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(fold.seat, ActionType.Fold);
  });

  it("should translate Flop correctly", () => {
    const flop = [
      { suit: 1, rank: 10 },
      { suit: 2, rank: 0 },
      { suit: 0, rank: 12 },
    ];
    translator.translate({
      card1: flop[0],
      card2: flop[1],
      card3: flop[2],
      typeName: <GameEventId>"FlopEvent",
    });
    expect(mockCurator.collectBoard).toBeCalledTimes(1);
    expect(mockCurator.collectBoard).toBeCalledWith(
      ...flop.map((card) => ({ suit: card.suit, rank: card.rank }))
    );
  });

  it("should translate Turn correctly", () => {
    translator.translate({
      card1: { suit: 0, rank: 0 },
      typeName: <GameEventId>"TurnEvent",
    });
    expect(mockCurator.collectBoard).toBeCalledTimes(1);
    expect(mockCurator.collectBoard).toBeCalledWith({ suit: 0, rank: 0 });
  });

  it("should translate River correctly", () => {
    translator.translate({
      card1: { suit: 0, rank: 0 },
      typeName: <GameEventId>"RiverEvent",
    });
    expect(mockCurator.collectBoard).toBeCalledTimes(1);
    expect(mockCurator.collectBoard).toBeCalledWith({ suit: 0, rank: 0 });
  });

  it("should translate Showdown correctly", () => {
    const pocket = {
      seat: 0,
      cards: [
        { suit: 0, rank: 9 },
        { suit: 2, rank: 5 },
      ],
    };
    translator.translate({
      seat: pocket.seat,
      card1: pocket.cards[0],
      card2: pocket.cards[1],
      typeName: <GameEventId>"ShowCardsEvent",
    });
    expect(mockCurator.recordPocket).toBeCalledTimes(1);
    expect(mockCurator.recordPocket).toBeCalledWith(
      pocket.seat,
      ...pocket.cards.map((card) => ({ suit: card.suit, rank: card.rank }))
    );
  });

  it("should translate End correctly", () => {
    translator.translate({ typeName: <GameEventId>"TakesPotEvent" });
    expect(mockCurator.exhibitGame).toBeCalledTimes(1);
  });
});
