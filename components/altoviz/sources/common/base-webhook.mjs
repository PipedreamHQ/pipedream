import altoviz from "../../altoviz.app.mjs";

export default {
  props: {
    altoviz,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      if (this._getHookId() != null) {
        return;
      }
      const { id } = await this.altoviz.createWebhook({
        data: {
          name: "Pipedream Webhook",
          url: this.http.endpoint,
          types: this.getEventTypes(),
        },
      });
      this._setHookId(id);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getEventTypes() {
      return this.eventTypes;
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: `New ${body.type} Event`,
      ts: Date.now(),
    });
  },
};
