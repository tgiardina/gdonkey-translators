import { GameEventId } from "./";

export interface EmptyGameEvent {
  pid: GameEventId;
}

export interface Action extends EmptyGameEvent {
  bet: number;
  btn: number;
  raise: number;
  seat: number;
}

export interface Blind extends EmptyGameEvent {
  bet: number;
  dead: number;
  seat: number;
}

export interface Button extends EmptyGameEvent {
  seat: number;
}

export interface FinalStacks extends EmptyGameEvent {
  account: number[];
}

export interface Flop extends EmptyGameEvent {
  bcard: number[];
}

export interface GameId extends EmptyGameEvent {
  stageNo: string;
}

export interface GameType extends EmptyGameEvent {
  bblind: number;
  sblind: number;
}

export interface Pocket extends EmptyGameEvent {
  card: [number, number];
  seat: number;
}

export interface Pockets extends EmptyGameEvent, Record<string, unknown> {
  seat1?: [number, number];
  seat2?: [number, number];
  seat3?: [number, number];
  seat4?: [number, number];
  seat5?: [number, number];
  seat6?: [number, number];
  seat7?: [number, number];
  seat8?: [number, number];
  seat9?: [number, number];
}

export interface Sit extends EmptyGameEvent {
  account: number;
  nickName: string;
  seat: number;
  type: number;
}

export interface Stack extends EmptyGameEvent {
  cash: number;
  seat: number;
}

export interface Start extends EmptyGameEvent {
  tableState: number;
}

export interface TurnRiver extends EmptyGameEvent {
  card: number;
}

type GameEvent =
  | EmptyGameEvent
  | Action
  | Blind
  | Button
  | FinalStacks
  | Flop
  | GameId
  | GameType
  | Pocket
  | Pockets
  | Sit
  | Stack
  | Start
  | TurnRiver;

export default GameEvent;
