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
      pid: <GameEventId>"ChatEvent",
    });
    Object.values(mockCurator).forEach((mock) =>
      expect(mock).not.toHaveBeenCalled()
    );
  });

  it("should translate GameType correctly", () => {
    const info = { bblind: 5, sblind: 2 };
    translator.translate({
      pid: GameEventId.GameType,
      ...info,
    });
    expect(mockCurator.startNewProject).toBeCalledTimes(1);
    expect(mockCurator.identifyBlind).toBeCalledTimes(2);
    expect(mockCurator.identifyBlind).toBeCalledWith(BlindSize.Big, 5);
    expect(mockCurator.identifyBlind).toBeCalledWith(BlindSize.Small, 2);
  });

  it("should translate Start correctly", () => {
    const start = { tableState: 2 };
    translator.translate({
      pid: GameEventId.Start,
      ...start,
    });
    expect(mockCurator.startNewGame).toBeCalledTimes(1);
  });

  it("should translate GameId correctly", () => {
    const info = { stageNo: "hi" };
    translator.translate({
      pid: GameEventId.GameId,
      ...info,
    });
    expect(mockCurator.identifyGame).toBeCalledTimes(1);
    expect(mockCurator.identifyGame).toBeCalledWith("hi");
  });

  it("should translate false Start correctly", () => {
    const start = { tableState: 4 };
    translator.translate({
      pid: GameEventId.Start,
      ...start,
    });
    expect(mockCurator.startNewGame).toBeCalledTimes(0);
  });

  it("should translate anonymous Sit correctly", () => {
    const player = { type: 1, seat: 7, account: 500, nickName: "" };
    translator.translate({
      pid: GameEventId.Sit,
      ...player,
    });
    expect(mockCurator.identifyPlayer).toBeCalledTimes(1);
    expect(mockCurator.identifyPlayer).toBeCalledWith(6);
    expect(mockCurator.identifyStack).toBeCalledTimes(1);
    expect(mockCurator.identifyStack).toBeCalledWith(6, 500);
    expect(mockCurator.identifyUser).toBeCalledTimes(0);
  });

  it("should translate user Sit correctly", () => {
    const player = { type: 1, seat: 7, account: 500, nickName: "abcd" };
    translator.translate({
      pid: GameEventId.Sit,
      ...player,
    });
    expect(mockCurator.identifyPlayer).toBeCalledTimes(1);
    expect(mockCurator.identifyPlayer).toBeCalledWith(6);
    expect(mockCurator.identifyStack).toBeCalledTimes(1);
    expect(mockCurator.identifyStack).toBeCalledWith(6, 500);
    expect(mockCurator.identifyUser).toBeCalledTimes(1);
    expect(mockCurator.identifyUser).toBeCalledWith(6);
  });

  it("should translate false Sit correctly", () => {
    const player = { type: 0, seat: 7, account: 500 };
    translator.translate({
      pid: GameEventId.Sit,
      ...player,
    });
    expect(mockCurator.identifyPlayer).toBeCalledTimes(0);
    expect(mockCurator.identifyStack).toBeCalledTimes(0);
  });

  it("should translate Stack correctly", () => {
    const stack = { seat: 7, cash: 500 };
    translator.translate({
      pid: GameEventId.Stack,
      ...stack,
    });
    expect(mockCurator.identifyStack).toBeCalledTimes(1);
    expect(mockCurator.identifyStack).toBeCalledWith(6, 500);
  });

  it("should translate Button correctly", () => {
    const action = { seat: 8 };
    translator.translate({
      pid: GameEventId.Button,
      ...action,
    });
    expect(mockCurator.identifyButton).toBeCalledTimes(1);
    expect(mockCurator.identifyButton).toBeCalledWith(7);
  });

  it("should translate Blind correctly", () => {
    const blind = { seat: 7, bet: 2, dead: 0 };
    translator.translate({
      pid: GameEventId.Blind,
      ...blind,
    });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(6, ActionType.PostBlind, 2);
  });

  it("should translate Blind Missed correctly", () => {
    const blind = { seat: 8, bet: 5, dead: 2 };
    translator.translate({
      pid: GameEventId.Blind,
      ...blind,
    });
    expect(mockCurator.recordAction).toBeCalledTimes(2);
    expect(mockCurator.recordAction).toBeCalledWith(7, ActionType.PostBlind, 5);
    expect(mockCurator.recordAction).toBeCalledWith(7, ActionType.Donate, 2);
  });

  it("should translate Pockets correctly", () => {
    const pockets = {
      junk: null,
      seat1: <[number, number]>[52, 52],
      seat4: <[number, number]>[22, 25],
      seat6: <[number, number]>[32896, 32896],
    };
    translator.translate({
      pid: GameEventId.Pockets,
      ...pockets,
    });
    expect(mockCurator.activateSeat).toBeCalledTimes(3);
    expect(mockCurator.activateSeat).toBeCalledWith(0);
    expect(mockCurator.activateSeat).toBeCalledWith(3);
    expect(mockCurator.activateSeat).toBeCalledWith(5);
    expect(mockCurator.recordPocket).toBeCalledTimes(1);
    expect(mockCurator.recordPocket).toBeCalledWith(
      3,
      { rank: 8, suit: 1 },
      { rank: 11, suit: 1 }
    );
    expect(mockCurator.arrangeGame).toHaveBeenCalledTimes(1);
  });

  it("should translate Raise Action correctly", () => {
    const action = { seat: 8, btn: 512, bet: 5, raise: 20 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(7, ActionType.BetRaise, 20);
  });

  it("should translate Bet action correctly", () => {
    const action = { seat: 2, btn: 128, bet: 5, raise: 0 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(1, ActionType.BetRaise, 5);
  });

  it("should translate Call action correctly", () => {
    const action = { seat: 2, btn: 256, bet: 5, raise: 0 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(1, ActionType.CheckCall);
  });

  it("should translate Check action correctly", () => {
    const action = { seat: 1, btn: 64, bet: 0, raise: 0 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(0, ActionType.CheckCall);
  });

  it("should translate Fold Action correctly", () => {
    const action = { seat: 9, btn: 1024, bet: 0, raise: 0 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(mockCurator.recordAction).toBeCalledTimes(1);
    expect(mockCurator.recordAction).toBeCalledWith(8, ActionType.Fold);
  });

  it("should translate Flop correctly", () => {
    const board = { bcard: [0, 1, 2] };
    translator.translate({
      pid: GameEventId.Flop,
      ...board,
    });
    expect(mockCurator.collectBoard).toBeCalledTimes(1);
    expect(mockCurator.collectBoard).toBeCalledWith(
      { rank: 12, suit: 0 },
      { rank: 0, suit: 0 },
      { rank: 1, suit: 0 }
    );
  });

  it("should translate TurnRiver correctly", () => {
    const board = { card: 17 };
    translator.translate({
      pid: GameEventId.TurnRiver,
      ...board,
    });
    expect(mockCurator.collectBoard).toBeCalledTimes(1);
    expect(mockCurator.collectBoard).toBeCalledWith({ rank: 3, suit: 1 });
  });

  it("should translate Pocket correctly", () => {
    const pocket = { seat: 4, card: [25, 13] };
    translator.translate({
      pid: GameEventId.Pocket,
      ...pocket,
    });
    expect(mockCurator.recordPocket).toBeCalledTimes(1);
    expect(mockCurator.recordPocket).toBeCalledWith(
      3,
      { rank: 11, suit: 1 },
      { rank: 12, suit: 1 }
    );
  });

  it("should translate Final Stacks correctly", () => {
    const stacks = { account: [150, 250, 531, 0, 0, 0, 0, 0, 490] };
    translator.translate({
      pid: GameEventId.FinalStacks,
      ...stacks,
    });
    expect(mockCurator.identifyStack).toBeCalledTimes(4);
    expect(mockCurator.identifyStack).toBeCalledWith(0, 150);
    expect(mockCurator.identifyStack).toBeCalledWith(1, 250);
    expect(mockCurator.identifyStack).toBeCalledWith(2, 531);
    expect(mockCurator.identifyStack).toBeCalledWith(8, 490);
    expect(mockCurator.exhibitGame).toBeCalledTimes(1);
  });
});
