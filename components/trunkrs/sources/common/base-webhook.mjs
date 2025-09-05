import trunkrs from "../../trunkrs.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    trunkrs,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { data } = await this.trunkrs.createWebhook({
        data: {
          url: this.http.endpoint,
          header: {},
          event: this.getEvent(),
        },
      });
      this._setHookId(data.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.trunkrs.deleteWebhook({
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
    generateMeta(event) {
      return {
        id: event.state.timestamp,
        summary: `New ${this.getEvent()} event received`,
        ts: Date.parse(event.state.timestamp),
      };
    },
    getEvent() {
      throw new ConfigurationError("getEvent is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
