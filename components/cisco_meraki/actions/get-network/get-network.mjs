import app from "../../cisco_meraki.app.mjs";

export default {
  key: "cisco_meraki-get-network",
  name: "Get Network",
  description: "Gets a network. [See the docs](https://developer.cisco.com/meraki/api/#!get-network).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
