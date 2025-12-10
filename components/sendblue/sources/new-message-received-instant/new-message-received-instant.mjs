import app from "../../sendblue.app.mjs";

export default {
  key: "sendblue-new-message-received-instant",
  name: "New Message Received (Instant)",
  description: "Emit new event when a new inbound message is received. [See the documentation](https://docs.sendblue.com/api/resources/webhooks/methods/create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const {
        app,
        http: { endpoint: webhookUrl },
      } = this;

      await app.addWebhook({
        data: {
          webhooks: [
            webhookUrl,
          ],
        },
      });
    },
    async deactivate() {
      const {
        app,
        http: { endpoint: webhookUrl },
      } = this;

      await app.deleteWebhook({
        data: {
          webhooks: [
            webhookUrl,
          ],
        },
      });
    },
  },
  methods: {
    generateMeta(message) {
      return {
        id: message.message_handle || `${message.from_number}-${message.date_sent}`,
        summary: `New message from ${message.from_number}: ${message.content?.substring(0, 50)}${
          message.content?.length > 50
            ? "..."
            : ""
        }`,
        ts: new Date(message.date_sent).getTime(),
      };
    },
  },
  async run(event) {
    const message = event.body;

    if (message && message.from_number) {
      const meta = this.generateMeta(message);
      this.$emit(message, meta);
    }
  },
};
