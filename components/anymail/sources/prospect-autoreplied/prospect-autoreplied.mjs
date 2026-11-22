import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-prospect-autoreplied",
  name: "Auto-Reply Received (Instant)",
  description: "Emit new event when a reply is recognised as an autoresponder, such as an out of office message. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "prospect_autoreplied";
    },
    getLabel() {
      return "Auto-Reply Received";
    },
  },
};
