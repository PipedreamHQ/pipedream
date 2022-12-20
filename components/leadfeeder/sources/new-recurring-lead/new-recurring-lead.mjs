import app from "../../leadfeeder.app.mjs";

export default {
  key: "leadfeeder-new-recurring-lead",
  name: "New Recurring Lead",
  description: "Emit new event when a lead is recurred. [See the docs](https://docs.leadfeeder.com/api/#get-all-visits-of-a-lead)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
