import twilio from "../twilio.app.mjs";
import twilioClient from "twilio";

export default {
  props: {
    twilio,
    incomingPhoneNumber: {
      propDefinition: [
        twilio,
        "incomingPhoneNumber",
      ],
    },
    authToken: {
      propDefinition: [
        twilio,
        "authToken",
      ],
    },
    http: {
      label: "HTTP Responder",
      description: "Exposes a `respond()` method that lets the source issue HTTP responses",
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const createWebhookResp = await this.setWebhook(
        this.incomingPhoneNumber,
        this.http.endpoint,
      );
      console.log(createWebhookResp);
    },
    async deactivate() {
      const deleteWebhookResp = await this.setWebhook(
        this.incomingPhoneNumber,
        "", // remove the webhook URL
      );
      console.log(deleteWebhookResp);
    },
  },
  methods: {
    getResponseBody() {
      return null;
    },
    isRelevant() {
      return true;
    },
    validateRequest(body, headers) {
      const twilioSignature = headers["x-twilio-signature"];
      if (!twilioSignature) {
        console.log("No x-twilio-signature header in request. Exiting.");
        return false;
      }

      /** See https://www.twilio.com/docs/usage/webhooks/webhooks-security */
      return twilioClient.validateRequest(
        this.authToken,
        twilioSignature,
        /** This must match the incoming URL exactly, which contains a / */
        `${this.http.endpoint}/`,
        body,
      );
    },
    emitEvent(body, headers) {
      const meta = this.generateMeta(body, headers);
      this.$emit(body, meta);
    },
  },
  async run(event) {
    let {
      body,
      headers,
    } = event;

    const responseBody = this.getResponseBody();
    if (responseBody) {
      this.http.respond({
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
        body: responseBody,
      });
    }

    if (typeof body !== "object")
      body = Object.fromEntries(new URLSearchParams(body));

    if (!this.isRelevant(body)) {
      console.log("Event not relevant. Skipping...");
      return;
    }

    if (!this.validateRequest(body, headers)) {
      console.log("Event could not be validated. Skipping...");
      return;
    }

    this.emitEvent(body, headers);
  },
};
