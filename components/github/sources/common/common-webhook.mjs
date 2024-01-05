import { ConfigurationError } from "@pipedream/platform";
import github from "../../github.app.mjs";
import { checkAdminPermission } from "./utils.mjs";

export default {
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
      reloadProps: true,
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  async additionalProps() {
    if (!await this.checkAdminPermission()) {
      throw new ConfigurationError("Webhooks are only supported on repos where you have admin access.");
    }

    return {};
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookEvents() {
      throw new Error("getWebhookEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    loadHistoricalEvents() {
      return true;
    },
    checkAdminPermission,
    async createWebhook() {
      if (this._getWebhookId()) {
        await this.removeWebhook();
      }
      const response = await this.github.createWebhook({
        repoFullname: this.repoFullname,
        data: {
          name: "web",
          config: {
            url: this.http.endpoint,
            content_type: "json",
          },
          events: this.getWebhookEvents(),
        },
      });
      this._setWebhookId(response.id);
    },
    async removeWebhook(webhookId = this._getWebhookId()) {
      if (webhookId) {
        await this.github.removeWebhook({
          repoFullname: this.repoFullname,
          webhookId,
        });
        this._setWebhookId(null);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.loadHistoricalEvents();
    },
    async activate() {
      await this.createWebhook();
    },
    async deactivate() {
      await this.removeWebhook();
    },
  },
};
