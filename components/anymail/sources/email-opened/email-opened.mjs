import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-email-opened",
  name: "Email Opened (Instant)",
  description: "Emit new event when a tracked message is opened. Apple Mail loads the pixel without a person, so treat it as a weak signal. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "email_opened";
    },
    getLabel() {
      return "Email Opened";
    },
  },
};
