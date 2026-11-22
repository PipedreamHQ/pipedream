import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-prospect-interested",
  name: "Prospect Interested (Instant)",
  description: "Emit new event when a reply is classified as interested, by the classifier or by a person. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "prospect_interested";
    },
    getLabel() {
      return "Prospect Interested";
    },
  },
};
