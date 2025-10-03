import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sinch-new-message-received",
  name: "New Message Received (Instant)",
  description: "Emit new event when a new message is received. [See the documentation](https://developers.sinch.com/docs/conversation/api-reference/conversation/tag/Webhooks/#tag/Webhooks/operation/Webhooks_CreateWebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    appId: {
      propDefinition: [
        common.props.sinch,
        "appId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.sinch.createWebhook({
        data: {
          target: this.http.endpoint,
          app_id: this.appId,
          triggers: [
            "MESSAGE_INBOUND",
          ],
          target_type: "HTTP",
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.sinch.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    generateMeta(event) {
      return {
        id: event.message_delivery_report.message_id,
        summary: `New message with ID: ${event.message_delivery_report.message_id}`,
        ts: Date.parse(event.event_time),
      };
    },
  },
  sampleEmit,
};
