import { Protocol } from "../enums";

export default interface Config {
  name: string;
  protocol: Protocol;
  srcUrls: string[];
  targetUrls: string[];
  hasImplicitBlinds?: boolean;
  isAnon?: boolean;
}
