import orderspace from "../../orderspace.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    orderspace,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { webhook } = await this.orderspace.createWebhook({
        data: {
          webhook: {
            endpoint: this.http.endpoint,
            events: this.getEvents(),
          },
        },
      });
      this._setHookId(webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.orderspace.deleteWebhook({
          webhookId: hookId,
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
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body || !body?.length) {
      return;
    }
    const { data } = body[0];
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
