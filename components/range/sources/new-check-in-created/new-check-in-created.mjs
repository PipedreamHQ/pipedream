import app from "../../range.app.mjs";

export default {
  key: "range-new-check-in-created",
  name: "New Check-In Created",
  description: "Emit new event when a new check-in is created. [See the docs](https://www.range.co/docs/api#rpc-list-updates).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
