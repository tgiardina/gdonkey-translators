import { GameEvent } from "./types";

export default function (event: string): GameEvent[] {
  return JSON.parse(event).events;
}
