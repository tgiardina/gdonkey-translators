import { casinos } from "../src";
import { Curator } from "../src/interfaces";

const mockCurator = <Curator>(<unknown>{
  identifyButton: jest.fn(),
});

describe("bovada integration", () => {
  it("should successfully translate an event", () => {
    const { config, parse, Translator } = casinos.bovada;
    const translator = new Translator(mockCurator);
    const parsedEvents = <unknown[]>(
      parse(`36|{"seat":8,"pid":"CO_DEALER_SEAT"}`)
    );
    parsedEvents.forEach((event) => translator.translate(event));
    expect(mockCurator.identifyButton).toHaveBeenCalledTimes(1);
    expect(mockCurator.identifyButton).toHaveBeenCalledWith(7);
    expect(config).not.toBeUndefined();
  });
});
