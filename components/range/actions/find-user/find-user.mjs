import app from "../../range.app.mjs";

export default {
  key: "range-find-user",
  name: "Find User",
  description: "Finds a user by email address. [See the docs](https://www.range.co/docs/api#rpc-find-user).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
