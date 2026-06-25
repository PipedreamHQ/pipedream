import sunshineConversations from "../../sunshine_conversations.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    sunshineConversations,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    info: {
      type: "alert",
      alertType: "warning",
      content: "Note: A custom integration may not have more than one webhook at a time. Creating a new webhook for custom integrations will replace the existing webhook.",
    },
    integrationId: {
      type: "string",
      label: "Integration ID",
      description: "The ID of the integration to create a webhook for. Use the **List Integrations** action to find the ID.",
    },
    includeFullUser: {
      type: "boolean",
      label: "Include Full User",
      description: "A boolean specifying whether webhook payloads should include the complete user schema for events involving a specific user.",
      optional: true,
    },
    includeFullSource: {
      type: "boolean",
      label: "Include Full Source",
      description: "A boolean specifying whether webhook payloads should include the client and device object (when applicable).",
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const data = {
        target: this.http.endpoint,
        triggers: this.getTriggers(),
        includeFullUser: this.includeFullUser,
      };

      let id;
      const { integration } = await this.sunshineConversations.getIntegration({
        integrationId: this.integrationId,
      });
      if (integration?.type !== "custom") {
        this._setIsCustomIntegration(false);
        const { webhook } = await this.sunshineConversations.createWebhook({
          integrationId: this.integrationId,
          data,
        });
        id = webhook?.id;
      } else {
        this._setIsCustomIntegration(true);
        const { webhooks } = await this.sunshineConversations.listWebhooks({
          integrationId: this.integrationId,
        });
        id = webhooks[0]?.id;
        if (id) {
          await this.sunshineConversations.updateWebhook({
            integrationId: this.integrationId,
            webhookId: id,
            data,
          });
        } else {
          const { webhook } = await this.sunshineConversations.createWebhook({
            integrationId: this.integrationId,
            data,
          });
          id = webhook?.id;
        }
      }

      this._setWebhookId(id);
    },
    async deactivate() {
      if (this._isCustomIntegration()) {
        return;
      }
      const webhookId = this._getWebhookId();
      await this.sunshineConversations.deleteWebhook({
        integrationId: this.integrationId,
        webhookId,
      });
    },
  },
  methods: {
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _isCustomIntegration() {
      return this.db.get("isCustomIntegration");
    },
    _setIsCustomIntegration(isCustomIntegration) {
      this.db.set("isCustomIntegration", isCustomIntegration);
    },
    getTriggers() {
      throw new ConfigurationError("getTriggers is not implemented");
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New ${event.type} event`,
        ts: Date.parse(event.createdAt),
      };
    },
  },
  async run({ body }) {
    if (!body?.events) {
      return;
    }

    this.http.respond({
      status: 200,
    });

    for (const event of body.events) {
      this.$emit(event, this.generateMeta(event));
    }
  },
};
