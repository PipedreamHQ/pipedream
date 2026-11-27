import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-prospect-not-interested",
  name: "Prospect Not Interested (Instant)",
  description: "Emit new event when a reply is classified as not interested. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "prospect_not_interested";
    },
    getLabel() {
      return "Prospect Not Interested";
    },
  },
};
