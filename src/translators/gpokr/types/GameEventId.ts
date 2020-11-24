enum GameEventId {
  BetRaise = "BetRaiseEvent",
  CheckCall = "CheckCallEvent",
  End = "TakesPotEvent",
  Flop = "FlopEvent",
  Fold = "FoldEvent",
  Init = "TableUpdateEvent",
  Pocket = "PocketCardsEvent",
  River = "RiverEvent",
  Showdown = "ShowCardsEvent",
  Sit = "SitDownEvent",
  Start = "StartHandEvent",
  Turn = "TurnEvent",
}

export default GameEventId;
