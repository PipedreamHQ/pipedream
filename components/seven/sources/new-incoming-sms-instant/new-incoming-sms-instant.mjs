import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "seven-new-incoming-sms-instant",
  name: "New Incoming SMS (Instant)",
  description: "Emit new event when a new inbound SMS is received. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/webhooks#register-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "sms_mo";
    },
    getSummary(details) {
      return `New incoming SMS: ${details.data.system}`;
    },
  },
  sampleEmit,
};
