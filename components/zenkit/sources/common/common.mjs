import zenkit from "../../zenkit.app.mjs";
import constants from "../common/constants.mjs";

export default {
  props: {
    zenkit,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const events = await this.getHistoricalEvents({
        limit: 25,
      });
      if (!events) {
        return;
      }
      for (const event of events) {
        this.emitEvent(event);
      }
    },
    async activate() {
      const { id } = await this.zenkit.createWebhook({
        data: {
          triggerType: constants.webhookTriggerTypes[this.getTriggerType()],
          url: this.http.endpoint,
          ...this.getWebhookParams(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.zenkit.deleteWebhook(hookId);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    getTriggerType() {
      throw new Error("getTriggerType is not implemented");
    },
    getWebhookParams() {
      return {};
    },
    generateMeta() {
      throw new Error("generateMeta is not imlemented");
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
  },
  async run(event) {
    const { body } = event;
    for (const item of body) {
      this.emitEvent(item);
    }
  },
};
