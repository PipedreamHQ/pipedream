import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-offer-opened",
  name: "Offer Opened (Instant)",
  description: "Emit new event when a recipient opens an offer for the first time. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "offer_opened";
    },
    getLabel() {
      return "Offer Opened";
    },
  },
};
