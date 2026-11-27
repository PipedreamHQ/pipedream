import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-offer-temperature-changed",
  name: "Offer Temperature Changed (Instant)",
  description: "Emit new event when an offer moves between hot, warm, neutral, cooling and cold. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "offer_temperature_changed";
    },
    getLabel() {
      return "Offer Temperature Changed";
    },
  },
};
