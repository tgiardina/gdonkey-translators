import { casinos } from "../src";
import { ActionType } from "../src/enums";
import { Curator } from "../src/interfaces";

const mockCurator = <Curator>(<unknown>{
  recordAction: jest.fn(),
});

describe("gpokr integration", () => {
  it("should successfully translate an event", () => {
    const { config, parse, Translator } = casinos.gpokr;
    const translator = new Translator(mockCurator);
    const parsedEvents = <unknown[]>parse(
      JSON.stringify({
        events: [
          {
            seat: 1,
            publisher: 184516,
            typeName: "CheckCallEvent",
          },
        ],
      })
    );
    parsedEvents.forEach((event) => translator.translate(event));
    expect(mockCurator.recordAction).toHaveBeenCalledTimes(1);
    expect(mockCurator.recordAction).toHaveBeenCalledWith(
      1,
      ActionType.CheckCall
    );
    expect(config).not.toBeUndefined();
  });
});
