import { Config, Curator } from "./";

interface Translator<T> {
  translate(event: T): void;
}

interface StaticTranslator<T> {
  new (curator: Curator): Translator<T>;
}

export default interface Bundle<T> {
  config: Config;
  parse(event: string): T;
  Translator: StaticTranslator<T>;
}
