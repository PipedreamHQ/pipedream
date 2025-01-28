import twilio from "../../twilio.app.mjs";

export default {
  props: {
    twilio,
    incomingPhoneNumber: {
      propDefinition: [
        twilio,
        "incomingPhoneNumber",
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
      const createWebhookResp = await this.twilio.setWebhookURL({
        serviceType: this.getServiceType(),
        phoneNumberSid: this.incomingPhoneNumber,
        url: this.http.endpoint,
      });
      console.log(createWebhookResp);
    },
    async deactivate() {
      // remove the webhook URL if url prop is not set
      const deleteWebhookResp = await this.twilio.setWebhookURL({
        serviceType: this.getServiceType(),
        phoneNumberSid: this.incomingPhoneNumber,
        url: "",
      });
      console.log(deleteWebhookResp);
    },
  },
  methods: {
    getServiceType() {
      throw new Error("getServiceType() is not implemented!");
    },
    getResponseBody() {
      return null;
    },
    isRelevant() {
      return true;
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

    if (typeof body !== "object") {
      body = Object.fromEntries(new URLSearchParams(body));
    }

    if (!this.isRelevant(body)) {
      console.log("Event not relevant. Skipping...");
      return;
    }

    const signature = headers["x-twilio-signature"];
    if (!signature) {
      console.log("No x-twilio-signature header in request. Exiting.");
      return;
    }

    // The url must match the incoming URL exactly, which contains a `/` at the end
    const isRequestValid = this.twilio.validateRequest({
      signature,
      url: `${this.http.endpoint}/`,
      params: body,
    });

    if (!isRequestValid) {
      console.log("Event could not be validated. Skipping...");
      return;
    }

    this.emitEvent(body, headers);
  },
};
