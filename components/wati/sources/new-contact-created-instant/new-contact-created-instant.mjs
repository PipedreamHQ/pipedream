import wati from "../../wati.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "wati-new-contact-created-instant",
  name: "New Contact Created",
  description: "Emit new event when a contact is created from an incoming WhatsApp message. [See the documentation](https://docs.wati.io/reference/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    wati: {
      type: "app",
      app: "wati",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    whatsappNumber: {
      propDefinition: [
        wati,
        "whatsappNumber",
      ],
    },
    contactName: {
      propDefinition: [
        wati,
        "contactName",
      ],
      optional: true,
    },
    messageContent: {
      propDefinition: [
        wati,
        "messageContent",
      ],
      optional: true,
    },
  },
  async run(event) {
    const {
      whatsappNumber, contactName, messageContent,
    } = event.body;

    await this.wati.emitContactCreatedEvent({
      whatsappNumber,
      contactName,
      messageContent,
    });

    this.$emit(event.body, {
      id: Date.now(),
      summary: `New contact created: ${contactName || whatsappNumber}`,
      ts: Date.now(),
    });
  },
};
