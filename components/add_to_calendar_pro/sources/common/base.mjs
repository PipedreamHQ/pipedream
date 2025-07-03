import addToCalendarPro from "../../add_to_calendar_pro.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    addToCalendarPro,
    db: "$.service.db",
    http: "$.interface.http",
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook",
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.addToCalendarPro.createWebhook({
        data: {
          name: this.name,
          active: true,
          payload_url: this.http.endpoint,
          trigger: this.getTrigger(),
          trigger_element: this.getTriggerElement(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.addToCalendarPro.deleteWebhook({
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
    getTrigger() {
      throw new ConfigurationError("getTrigger must be implemented");
    },
    getTriggerElement() {
      throw new ConfigurationError("getTriggerElement must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
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
