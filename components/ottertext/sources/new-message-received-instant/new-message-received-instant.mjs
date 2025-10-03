import ottertext from "../../ottertext.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ottertext-new-message-received-instant",
  name: "New Message Received Instant",
  description: "Emit new event when a new message is received from an opted-in customer or a new customer.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ottertext: {
      type: "app",
      app: "ottertext",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    customerIdOrNumber: {
      propDefinition: [
        ottertext,
        "customerIdOrNumber",
      ],
    },
    messageType: {
      propDefinition: [
        ottertext,
        "messageType",
        (c) => ({
          optional: true,
        }),
      ],
    },
    messageContent: {
      propDefinition: [
        ottertext,
        "messageContent",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      // Placeholder for deploy hook logic
    },
    async activate() {
      // Placeholder for activate hook logic
    },
    async deactivate() {
      // Placeholder for deactivate hook logic
    },
  },
  async run(event) {
    const body = event.body;
    if (body.customerIdOrNumber && (body.messageType === "opt-in" || !this.db.get(body.customerIdOrNumber))) {
      await this.ottertext.emitMessageReceivedEvent({
        customerIdOrNumber: body.customerIdOrNumber,
        messageType: body.messageType,
        messageContent: body.messageContent,
      });

      this.$emit(body, {
        id: body.customerIdOrNumber + "-" + Date.now(),
        summary: `New message from ${body.customerIdOrNumber}`,
        ts: Date.now(),
      });

      this.db.set(body.customerIdOrNumber, true);
    } else {
      this.http.respond({
        status: 400,
        body: "Invalid data received",
      });
    }
  },
};
