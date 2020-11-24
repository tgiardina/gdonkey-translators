import { Protocol } from "../../enums";
import { Config } from "../../interfaces";

const config: Config = {
  name: "gpokr",
  protocol: Protocol.Http,
  srcUrls: [
    "*://*.gpokr.com/{,#R-O-B-B-Y,#HORSIE,#NAGLINJO,#GetPaid24,#Pacific Place}",
  ],
  targetUrls: ["*://*.gpokr.com/api/gpokr/table/events?*"],
  hasImplicitBlinds: true,
};

export default config;
