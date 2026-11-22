import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-unsubscribe",
  name: "Prospect Unsubscribed (Instant)",
  description: "Emit new event when a prospect uses the one-click unsubscribe link. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "unsubscribe";
    },
    getLabel() {
      return "Prospect Unsubscribed";
    },
  },
};
