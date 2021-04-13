const twilio = require("../twilio.app.js");
const twilioClient = require("twilio");

module.exports = {
  props: {
    twilio,
    incomingPhoneNumber: { propDefinition: [twilio, "incomingPhoneNumber"] },
    authToken: { propDefinition: [twilio, "authToken"] },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const webhookFn = this.getWebhookFn();
      console.log(
        `Creating webhook for phone number ${this.incomingPhoneNumber}`
      );
      const createWebhookResp = await webhookFn(
        this.incomingPhoneNumber,
        this.http.endpoint
      );
      console.log(createWebhookResp);
    },
    async deactivate() {
      const webhookFn = this.getWebhookFn();
      console.log(
        `Removing webhook from phone number ${this.incomingPhoneNumber}`
      );
      const deleteWebhookResp = await webhookFn(
        this.incomingPhoneNumber,
        "" // remove the webhook URL
      );
      console.log(deleteWebhookResp);
    },
  },
  methods: {
    getResponseBody() {
      return null;
    },
    isRelevant(body) {
      return true;
    },
    validateRequest(body, headers) {
      const twilioSignature = headers["x-twilio-signature"];
      if (!twilioSignature) {
        console.log("No x-twilio-signature header in request. Exiting.");
        return false;
      }

      /** See https://www.twilio.com/docs/usage/webhooks/webhooks-security */
      if (
        !twilioClient.validateRequest(
          this.authToken,
          twilioSignature,
          /** This must match the incoming URL exactly, which contains a / */
          `${this.http.endpoint}/`,
          body
        )
      ) {
        throw new Error(
          "Computed Twilio signature doesn't match signature received in header"
        );
      }
      return true;
    },
    emitEvent(body, headers) {
      const meta = this.generateMeta(body, headers);
      this.$emit(body, meta);
    },
  },
  async run(event) {
    let { body, headers } = event;

    const responseBody = this.getResponseBody();
    if (responseBody) {
      this.http.respond({
        status: 200,
        headers: { "Content-Type": "text/xml" },
        body: responseBody,
      });
    }

    if (typeof body !== "object")
      body = Object.fromEntries(new URLSearchParams(body));

    if (!this.isRelevant(body)) return;

    if (!this.validateRequest(body, headers)) return;

    this.emitEvent(body, headers);
  },
};