const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "twilio-new-call",
  name: "New Call (Instant)",
  description:
    "Configures a webhook in Twilio, tied to a phone number, and emits an event each time a call to that number is completed",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookFn() {
      return this.twilio.setIncomingCallWebhookURL.bind(this);
    },
    generateMeta(body, headers) {
      return {
        /** if Twilio retries a message, but we've already emitted, dedupe */
        id: headers["i-twilio-idempotency-token"],
        summary: `New call from ${body.From}`,
        ts: Date.now(),
      };
    },
    isRelevant(body) {
      if (body.CallStatus == "completed") return true;
      return false;
    },
  },
};