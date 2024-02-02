import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-email-sent",
  name: "Email Sent",
  description: "Emit new event when an email is sent.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "thread.email_sent";
    },
    getSummary({ payload }) {
      return `Email Sent ID ${payload.email.id}`;
    },
  },
  sampleEmit,
};
