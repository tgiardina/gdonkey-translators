import { Protocol } from "../../enums";
import { Config } from "../../interfaces";

const config: Config = {
  name: "bovada",
  protocol: Protocol.WebSocket,
  srcUrls: ["*://*.bovada.lv/static/poker-game/*"],
  targetUrls: ["*://*.bovada.lv"],
  isAnon: true,
};

export default config;
