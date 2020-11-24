enum GameEventId {
  Action = "CO_SELECT_INFO",
  Blind = "CO_BLIND_INFO",
  Button = "CO_DEALER_SEAT",
  FinalStacks = "CO_RESULT_INFO",
  Flop = "CO_BCARD3_INFO",
  GameId = "PLAY_STAGE_INFO",
  GameType = "CO_OPTION_INFO",
  Pocket = "CO_PCARD_INFO",
  Pockets = "CO_CARDTABLE_INFO",
  Sit = "PLAY_SEAT_INFO",
  Stack = "PLAY_ACCOUNT_CASH_RES",
  Start = "CO_TABLE_STATE",
  TurnRiver = "CO_BCARD1_INFO",
}

export default GameEventId;
