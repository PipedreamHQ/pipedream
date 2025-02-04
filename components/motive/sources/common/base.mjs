import { v4 as uuid } from "uuid";
import motive from "../../motive.app.mjs";

export default {
  props: {
    motive,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    filterEvent() {
      return true;
    },
  },
  hooks: {
    async deploy() {
      const response = await this.motive.createWebhook({
        data: {
          url: this.http.endpoint,
          secret: uuid(),
          actions: this.getActions(),
          format: "json",
          enabled: true,
          webhook_type: "POST",
        },
      });
      this._setHookId(response.company_webhook.id);
    },
    async activate() {
      await this.motive.updateWebhook({
        webhookId: this._getHookId(),
        data: {
          enabled: true,
        },
      });
    },
    async deactivate() {
      await this.motive.updateWebhook({
        webhookId: this._getHookId(),
        data: {
          enabled: false,
        },
      });
    },
  },
  async run({ body }) {
    if (this.filterEvent(body)) {
      this.$emit(body, {
        id: body.id,
        summary: this.getSummary(body),
        ts: Date.parse(body.end_time || new Date()),
      });
    }
  },
};
