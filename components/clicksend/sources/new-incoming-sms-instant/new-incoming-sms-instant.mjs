import clicksend from "../../clicksend.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clicksend-new-incoming-sms-instant",
  name: "New Incoming SMS (Instant)",
  description: "Emits an event for each new incoming SMS message received. [See the documentation](https://developers.clicksend.com/docs/rest/v3/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clicksend: {
      type: "app",
      app: "clicksend",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    receiverPhoneNumber: {
      propDefinition: [
        clicksend,
        "receiverPhoneNumber",
      ],
    },
    messageContent: {
      propDefinition: [
        clicksend,
        "messageContent",
      ],
    },
  },
  hooks: {
    async activate() {
      // No webhook activation is required for this component
    },
    async deactivate() {
      // No webhook deactivation is required for this component
    },
  },
  async run(event) {
    const { body } = event;

    // Validate the incoming data (perform any necessary checks)
    if (!body || !body.to || !body.body) {
      this.http.respond({
        status: 400,
        body: "Bad Request: Missing required fields",
      });
      return;
    }

    // Validate that the incoming message is from the expected phone number
    if (body.to !== this.receiverPhoneNumber) {
      this.http.respond({
        status: 403,
        body: "Forbidden: Received message from unexpected phone number",
      });
      return;
    }

    // Emit the event with the message content
    this.$emit(body, {
      id: body.message_id || `${body.date}-${body.to}`,
      summary: `New SMS from ${body.from}: ${body.body}`,
      ts: body.date
        ? Date.parse(body.date)
        : new Date().getTime(),
    });

    // Respond to the HTTP request to acknowledge receipt
    this.http.respond({
      status: 200,
      body: "Received",
    });
  },
};
