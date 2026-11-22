import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-prospect-maybe-later",
  name: "Prospect Maybe Later (Instant)",
  description: "Emit new event when a reply is classified as neutral (maybe later). [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "prospect_maybe_later";
    },
    getLabel() {
      return "Prospect Maybe Later";
    },
  },
};
