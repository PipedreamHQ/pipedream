import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-new-reply",
  name: "New Reply (Instant)",
  description: "Emit new event when a prospect replies. Fires before the reply is classified. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "new_reply";
    },
    getLabel() {
      return "New Reply";
    },
  },
};
