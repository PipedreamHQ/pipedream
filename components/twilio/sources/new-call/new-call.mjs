import common from "../common/common-webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "twilio-new-call",
  name: "New Call (Instant)",
  description: "Emit new event each time a call to the phone number is completed. Configures a webhook in Twilio, tied to a phone number.",
  version: "0.1.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getServiceType() {
      return constants.SERVICE_TYPE.VOICE;
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
