const twilio = require("https://github.com/PipedreamHQ/pipedream/components/twilio/twilio.app.js");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const twilioClient = require("twilio");

module.exports = {
  name: "New Incoming SMS",
  description:
    "Configures a webhook in Twilio, tied to an incoming phone number, and emits an event each time an SMS is sent to that number",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    twilio,
    incomingPhoneNumber: { propDefinition: [twilio, "incomingPhoneNumber"] },
    authToken: { propDefinition: [twilio, "authToken"] },
    responseMessage: { propDefinition: [twilio, "responseMessage"] },
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      console.log(
        `Creating webhook for phone number ${this.incomingPhoneNumber}`
      );
      const createWebhookResp = await this.twilio.setIncomingSMSWebhookURL(
        this.incomingPhoneNumber,
        this.http.endpoint
      );
      console.log(createWebhookResp);
    },
    async deactivate() {
      console.log(
        `Removing webhook from phone number ${this.incomingPhoneNumber}`
      );
      const deleteWebhookResp = await this.twilio.setIncomingSMSWebhookURL(
        this.incomingPhoneNumber,
        "" // remove the webhook URL
      );
      console.log(deleteWebhookResp);
    },
  },
  async run(event) {
    const { body, headers } = event;
    const twiml = new MessagingResponse();

    twiml.message(this.responseMessage);

    // Respond to the user with the message provided in the source's configuration
    this.http.respond({
      status: 200,
      headers: { "Content-Type": "text/xml" },
      body: twiml.toString(),
    });

    const twilioSignature = headers["x-twilio-signature"];
    if (!twilioSignature) {
      console.log("No x-twilio-signature header in request. Exiting.");
      return;
    }

    // See https://www.twilio.com/docs/usage/webhooks/webhooks-security
    if (
      !twilioClient.validateRequest(
        this.authToken,
        twilioSignature,
        `${this.http.endpoint}/`, // This must match the incoming URL exactly, which contains a /
        body
      )
    ) {
      throw new Error(
        "Computed Twilio signature doesn't match signature received in header"
      );
    }

    this.$emit(body, {
      summary: body.Body, // the content of the text message
      id: headers["i-twilio-idempotency-token"], // if Twilio retries a message, but we've already emitted, dedupe
    });
  },
};
