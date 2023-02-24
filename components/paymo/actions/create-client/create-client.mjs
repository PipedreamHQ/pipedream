import app from "../../paymo.app.mjs";

export default {
  key: "paymo-create-client",
  name: "Create Client",
  description: "Creates a client. [See the docs](https://github.com/paymoapp/api/blob/master/sections/clients.md#create).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
