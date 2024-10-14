import attio from "../../attio.app.mjs";

export default {
  props: {
    attio,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { data: { id: { webhook_id: hookId } } } = await this.attio.createWebhook({
        data: {
          data: {
            target_url: this.http.endpoint,
            subscriptions: [
              {
                event_type: this.getEventType(),
                filter: this.getFilter(),
              },
            ],
          },
        },
      });
      this._setHookId(hookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.attio.deleteWebhook({
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
    getFilter() {
      return null;
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body: { events } } = event;
    if (!events?.length) {
      return;
    }
    events.forEach((item) => {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    });
  },
};
