import twilio from "twilio";
import common from "../common/common-webhook.mjs";
import constants from "../../common/constants.mjs";

const MessagingResponse = twilio.twiml.MessagingResponse;

export default {
  ...common,
  key: "twilio-new-incoming-sms",
  name: "New Incoming SMS (Instant)",
  description: "Emit new event every time an SMS is sent to the phone number set. Configures a webhook in Twilio, tied to an incoming phone number.",
  version: "0.1.4",
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
    getServiceType() {
      return constants.SERVICE_TYPE.SMS;
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
