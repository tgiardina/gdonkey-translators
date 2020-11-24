import { GameEventId } from ".";

export interface EmptyGameEvent {
  typeName: GameEventId;
}

export interface BetRaise extends EmptyGameEvent {
  amount: number;
  seat: number;
}

export interface CheckCall extends EmptyGameEvent {
  seat: number;
}

export interface Flop extends EmptyGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
  card2: {
    suit: number;
    rank: number;
  };
  card3: {
    suit: number;
    rank: number;
  };
}

export interface Fold extends EmptyGameEvent {
  seat: number;
}

export interface Init extends EmptyGameEvent {
  table: {
    gameInfo: {
      playerInfo: ({
        forceBlind: boolean;
        user: {
          name: string;
        };
      } | null)[];
    };
  };
}

export interface Pocket extends EmptyGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
  card2: {
    suit: number;
    rank: number;
  };
  seat: number;
}

export interface River extends EmptyGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
}

export interface Showdown extends EmptyGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
  card2: {
    suit: number;
    rank: number;
  };
  seat: number;
}

export interface Sit extends EmptyGameEvent {
  player: {
    seat: number;
    user: {
      name: string;
    };
  };
}

export interface Start extends EmptyGameEvent {
  bigblind: number;
  chips: number[];
  dealer: number;
  gameId: number;
  smallblind: number;
}

export interface Turn extends EmptyGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
}

type GameEvent =
  | EmptyGameEvent
  | BetRaise
  | CheckCall
  | Flop
  | Fold
  | Init
  | Pocket
  | River
  | Showdown
  | Sit
  | Start
  | Turn;

export default GameEvent;
