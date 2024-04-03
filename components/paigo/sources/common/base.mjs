import paigo from "../../paigo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    paigo,
    db: "$.service.db",
    http: "$.interface.http",
    environment: {
      type: "string",
      label: "Environment",
      description: "The environment the webhook is for. This is used to differentiate between sandbox and production. Will default to `production` if not provided.",
      options: constants.ENVIRONMENTS,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const data = {
        hookUrl: this.http.endpoint,
        webhookType: this.getWebhookType(),
      };
      if (this.offeringId) {
        data.offeringId = this.offeringId;
      }
      if (this.environment) {
        data.environment = this.environment;
      }
      const { webhookId } = await this.paigo.createWebhook({
        data,
      });
      this._setHookId(webhookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.paigo.deleteWebhook({
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getWebhookType() {
      throw new Error("getWebhookType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
