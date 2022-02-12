import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "twilio-new-call",
  name: "New Call (Instant)",
  description:
    "Configures a webhook in Twilio, tied to a phone number, and emits an event each time a call to that number is completed",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async setWebhook(...args) {
      return await this.twilio.setIncomingCallWebhookURL(...args);
    },
    generateMeta(body, headers) {
      return {
        /** if Twilio retries a message, but we've already emitted, dedupe */
        id: headers["i-twilio-idempotency-token"],
        summary: `New call from ${this.getMaskedNumber(body.From)}`,
        ts: Date.now(),
      };
    },
    isRelevant(body) {
      return body.CallStatus == "completed";
    },
    getMaskedNumber(number) {
      const { length: numberLength } = number;
      return number.slice(numberLength - 4).padStart(numberLength, "#");
    },
  },
};
