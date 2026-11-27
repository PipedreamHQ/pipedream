import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-prospect-added",
  name: "New Prospect (Instant)",
  description: "Emit new event when a prospect is created, in the app, by an import or through the API. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "prospect_added";
    },
    getLabel() {
      return "New Prospect";
    },
  },
};
