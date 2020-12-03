import { ActionType, BlindSize } from "../enums";
import { Card } from "./";

export default interface Curator {
  /**
   * Start completely fresh. (Note: All calls to a curator are ignored until you start a project.)
   */
  startNewProject(): void;

  /**
   * Start researching a new game. (Note: calls to `identify` methods and `arrangeMissedBlind` are not reset during a new game, but everything else is.)
   */
  startNewGame(): void;

  /**
   * Overwrite the game id.
   */
  identifyGame(id: string): void;

  /**
   * Overwrite the blind size.
   */
  identifyBlind(type: BlindSize, amount: number): void;

  /**
   * Overwrite player at given seat. (Note: if `config.isAnon: true`, name will be ignored. Otherwise, it is required.)
   */
  identifyPlayer(seat: number, name?: string): void;

  /**
   * Overwrite stack at given seat.
   */
  identifyStack(seat: number, stack: number): void;

  /**
   * Overwrite the button location.
   */
  identifyButton(seat: number): void;

  /**
   * Marks the player at the given seat.
   */
  identifyUser(seat: number): void;

  /**
   * Activates an identified seat next time game is arranged.
   */
  activateSeat(seat: number): void;

  /**
   * Force seat to pay missed blind next time game is arranged. (Note: Only use this if `config.hasImplicitBlinds: true`.)
   */
  activateMissedBlind(seat: number): void;

  /**
   * Configures the game so the curator is ready for actions.
   */
  arrangeGame(): void;

  /**
   * Record pocket cards for next exhibit.
   */
  recordPocket(seat: number, card1: Card, card2: Card): void;

  /**
   * Record an action for next exhibit (Note: This must be called after arrange)
   */
  recordAction(seat: number, type: ActionType, amount?: number): void;

/**
   * Record an action for next exhibit (Note: This must be called after arrange)
   */
  recordAction(seat: number, type: ActionType, amount?: number): void;  

  /**
   * Collect board cards for next exhibit.
   */
  collectBoard(...cards: Card[]): void;

  /**
   * Present the current game.
   */
  exhibitGame(): Promise<void>;
}
