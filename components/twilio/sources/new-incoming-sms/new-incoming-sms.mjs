import common from "../common-webhook.mjs";
import twilio from "twilio";
const MessagingResponse = twilio.twiml.MessagingResponse;

export default {
  ...common,
  key: "twilio-new-incoming-sms",
  name: "New Incoming SMS (Instant)",
  description:
    "Configures a webhook in Twilio, tied to an incoming phone number, and emits an event each time an SMS is sent to that number",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    responseMessage: {
      propDefinition: [
        common.props.twilio,
        "responseMessage",
      ],
    },
  },
  methods: {
    ...common.methods,
    async setWebhook(...args) {
      return await this.twilio.setIncomingSMSWebhookURL(...args);
    },
    getResponseBody() {
      const twiml = new MessagingResponse();
      let responseBody = "<Response></Response>";
      if (this.responseMessage) {
        twiml.message(this.responseMessage);
        responseBody = twiml.toString();
      }
      return responseBody;
    },
    generateMeta(body, headers) {
      return {
        /** if Twilio retries a message, but we've already emitted, dedupe */
        id: headers["i-twilio-idempotency-token"],
        summary: body.Body,
        ts: Date.now(),
      };
    },
  },
};
