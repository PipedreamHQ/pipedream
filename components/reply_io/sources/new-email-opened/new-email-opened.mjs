import common from "../common/base.mjs";

export default {
  ...common,
  key: "reply_io-new-email-opened",
  name: "New Email Opened",
  description: "Emit new event when a person opens your email. [See the docs here](https://apidocs.reply.io/#84947c50-24b8-411c-bb71-d6cddf49fc16)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_opened";
    },
  },
};
