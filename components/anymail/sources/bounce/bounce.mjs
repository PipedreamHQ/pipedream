import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-bounce",
  name: "Email Bounced (Instant)",
  description: "Emit new event when a message to a prospect bounces. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "bounce";
    },
    getLabel() {
      return "Email Bounced";
    },
  },
};
