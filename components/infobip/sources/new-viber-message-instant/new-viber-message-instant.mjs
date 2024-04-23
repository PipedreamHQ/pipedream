import infobip from "../../infobip.app.mjs";

export default {
  key: "infobip-new-viber-message-instant",
  name: "New Viber Message Instant",
  description: "Emits a new event when a new message is received on Viber.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    infobip,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const response = await this.infobip._makeRequest({
        method: "POST",
        path: "/resource-management/1/inbound-message-configurations",
        data: {
          channel: "VIBER",
          forwarding: {
            type: "PULL",
          },
        },
      });
      this.db.set("configurationKey", response.configurationKey);
    },
    async deactivate() {
      const configurationKey = this.db.get("configurationKey");
      await this.infobip._makeRequest({
        method: "DELETE",
        path: `/resource-management/1/inbound-message-configurations/${configurationKey}`,
      });
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.messageId,
      summary: `New Viber message from ${event.body.from}`,
      ts: Date.parse(event.body.receivedAt),
    });
  },
};
