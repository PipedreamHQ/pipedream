import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-offer-read",
  name: "Offer Read (Instant)",
  description: "Emit new event when a recipient reads an offer to the end. Fires once per offer. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "offer_read";
    },
    getLabel() {
      return "Offer Read";
    },
  },
};
