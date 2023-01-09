import common from "../common/base.mjs";

export default {
  ...common,
  key: "reply_io-new-email-sent",
  name: "New Email Sent",
  description: "Emit new event when a new email is sent (first step or follow-up).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "email_sent";
    },
  },
  async run(event) {
    console.log(event);
  },
};
