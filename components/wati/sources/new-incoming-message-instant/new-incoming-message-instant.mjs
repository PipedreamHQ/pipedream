import wati from "../../wati.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "wati-new-incoming-message-instant",
  name: "New Incoming Message Instant",
  description: "Emit new event when there is an incoming message on your number. [See the documentation](https://docs.wati.io/reference/get_api-v1-getmessages-whatsappnumber)",
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
    messageContent: {
      propDefinition: [
        wati,
        "messageContent",
        {
          optional: true,
        },
      ],
    },
    timestamp: {
      propDefinition: [
        wati,
        "timestamp",
        {
          optional: true,
        },
      ],
    },
  },
  hooks: {
    async deploy() {
      const messages = await this.wati._makeRequest({
        path: `/getMessages/${this.whatsappNumber}`,
        params: {
          pageSize: 50,
          pageNumber: 1,
        },
      });
      if (messages && messages.messages && messages.messages.items) {
        const items = messages.messages.items.slice(-50).reverse();
        for (const item of items) {
          this.$emit(item, {
            id: item.id,
            summary: `New message: ${item.messageContent || "No content"}`,
            ts: new Date(item.created).getTime(),
          });
        }
      }
    },
    async activate() {
      this.http.endpointUrl();
    },
    async deactivate() {
      // No specific deactivation hook for this component
    },
  },
  async run(event) {
    const {
      whatsappNumber, messageContent, timestamp,
    } = event.body;

    this.$emit(event.body, {
      id: event.body.id,
      summary: `New message from ${whatsappNumber}`,
      ts: timestamp
        ? new Date(timestamp).getTime()
        : Date.now(),
    });
  },
};
