import app from "../../cisco_meraki.app.mjs";

export default {
  key: "cisco_meraki-create-organization",
  name: "Create Organization",
  description: "Creates a new organization. [See the docs](https://developer.cisco.com/meraki/api/#!create-organization).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
