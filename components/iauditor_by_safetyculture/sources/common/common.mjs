import safetyculture from "../../iauditor_by_safetyculture.app.mjs";

export default {
  props: {
    safetyculture,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { webhook } = await this.safetyculture.createWebhook({
        data: {
          url: this.http.endpoint,
          trigger_events: [
            this.getEvent(),
          ],
        },
      });
      if (!webhook?.webhook_id) {
        return;
      }
      this._setHookId(webhook.webhook_id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.safetyculture.deleteWebhook({
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
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body: { data } } = event;
    if (!data) {
      return;
    }
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
