import { ConfigurationError } from "@pipedream/platform";
import github from "../../github.app.mjs";
import { checkOrgAdminPermission } from "./utils.mjs";

export default {
  props: {
    github,
    org: {
      propDefinition: [
        github,
        "orgName",
      ],
      reloadProps: true,
    },
    repo: {
      propDefinition: [
        github,
        "repoOrg",
        (c) => ({
          org: c.org,
        }),
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  async additionalProps() {
    await this.requireAdminPermission();
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
    checkOrgAdminPermission,
    async requireAdminPermission() {
      if (!await this.checkOrgAdminPermission()) {
        throw new ConfigurationError("Webhooks are only supported on organizations where you have admin access.");
      }
    },
  },
  hooks: {
    async deploy() {
      await this.requireAdminPermission();
      await this.loadHistoricalEvents();
    },
    async activate() {
      const response = await this.github.createOrgWebhook({
        org: this.org,
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
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.github.removeOrgWebhook({
        org: this.org,
        webhookId,
      });
    },
  },
};
