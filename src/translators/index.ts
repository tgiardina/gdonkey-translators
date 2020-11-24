import { Bundle } from "../interfaces";
import * as bovada from "./bovada";
import * as gpokr from "./gpokr";

const casinos: Record<string, Bundle<unknown>> = {
  bovada,
  gpokr,
};

export default casinos;
