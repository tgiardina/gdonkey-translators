import { Curator } from "../../interfaces";

export default ({
  startNewProject: jest.fn(),
  startNewGame: jest.fn(),
  identifyBlind: jest.fn(),
  identifyButton: jest.fn(),
  identifyGame: jest.fn(),
  identifyPlayer: jest.fn(),
  identifyStack: jest.fn(),
  identifyUser: jest.fn(),
  activateSeat: jest.fn(),
  activateMissedBlind: jest.fn(),
  arrangeGame: jest.fn(),
  recordBlind: jest.fn(),  
  recordPocket: jest.fn(),
  recordAction: jest.fn(),
  collectBoard: jest.fn(),
  exhibitGame: jest.fn(),
} as unknown) as Curator;
