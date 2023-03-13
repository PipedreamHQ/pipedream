import app from "../../cisco_meraki.app.mjs";

export default {
  key: "cisco_meraki-update-network",
  name: "Update Network",
  description: "Updates a network. [See the docs](https://developer.cisco.com/meraki/api/#!update-network).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
