const MessagingResponse = require("twilio").twiml.MessagingResponse;
const twilioClient = require("twilio");

const twilio = {
  type: "app",
  app: "twilio",
  propDefinitions: {
    authToken: {
      type: "string",
      label: "Twilio Auth Token",
      description:
        "The Twilio auth token, found [in your Twilio console](https://www.twilio.com/console)",
    },
    incomingPhoneNumber: {
      type: "string",
      label: "Incoming Phone Number",
      description: "The Twilio phone number where you'll receive messages",
      async options() {
        return await this.listIncomingPhoneNumbers();
      },
    },
    responseMessage: {
      type: "string",
      label: "SMS Response Message",
      description: "The SMS message you want to send in response",
    },
  },
  methods: {
    getClient() {
      return twilioClient(this.$auth.Sid, this.$auth.Secret, {
        accountSid: this.$auth.AccountSid,
      });
    },
    async setIncomingSMSWebhookURL(phoneNumberSid, url) {
      const client = this.getClient();
      return await client.incomingPhoneNumbers(phoneNumberSid).update({
        smsMethod: "POST",
        smsUrl: url,
      });
    },
    async listIncomingPhoneNumbers() {
      const client = this.getClient();
      const numbers = await client.incomingPhoneNumbers.list();
      return numbers.map((number) => {
        return { label: number.friendlyName, value: number.sid };
      });
    },
  },
};

module.exports = {
  name: "Incoming SMS",
  version: "0.0.1",
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
        `Creating webhook for phone number ${this.incomingPhoneNumber} to point to this source`
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
      throw new Error("signature mismatch");
    }

    this.$emit(body, {
      summary: body.Body, // the content of the text message
      id: headers["i-twilio-idempotency-token"], // if Twilio retries a message, but we've already emitted, dedupe
    });
  },
};
