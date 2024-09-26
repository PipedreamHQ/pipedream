import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-email-received",
  name: "Email Received",
  description: "Emit new event when an email is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "thread.email_received";
    },
    getSummary({ payload }) {
      return `Email Received ID ${payload.email.id}`;
    },
  },
  sampleEmit,
};
