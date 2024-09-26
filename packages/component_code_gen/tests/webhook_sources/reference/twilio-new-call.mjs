export default {
  key: "twilio-new-call",
  name: "New Call (Instant)",
  description: "Emit new event each time a call to the phone number is completed. Configures a webhook in Twilio, tied to a phone number.",
  version: "0.1.3",
  type: "source",
  dedupe: "unique",
  props: {
    twilio: {
      type: "app",
      app: "twilio",
    },
    incomingPhoneNumber: {
      type: "string",
      label: "Incoming Phone Number",
      description: "The Twilio phone number where you'll receive messages. This source creates a webhook tied to this incoming phone number, **overwriting any existing webhook URL**.",
      async options() {
        const numbers = await this.listIncomingPhoneNumbers();
        return numbers.map((number) => {
          return {
            label: number.friendlyName,
            value: number.sid,
          };
        });
      },
    },
    authToken: {
      type: "string",
      secret: true,
      label: "Twilio Auth Token",
      description: "Your Twilio auth token, found [in your Twilio console](https://www.twilio.com/console). Required for validating Twilio events.",
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
      return "voice";
    },
    getResponseBody() {
      return null;
    },
    isRelevant(body) {
      return body.CallStatus == "completed";
    },
    emitEvent(body, headers) {
      this.$emit(body, {
        /** if Twilio retries a message, but we've already emitted, dedupe */
        id: headers["i-twilio-idempotency-token"],
        summary: `New call from ${this.getMaskedNumber(body.From)}`,
        ts: Date.now(),
      });
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
      authToken: this.authToken,
    });

    if (!isRequestValid) {
      console.log("Event could not be validated. Skipping...");
      return;
    }

    this.emitEvent(body, headers);
  },
};
