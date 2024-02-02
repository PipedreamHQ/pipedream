import cloudpress from "../../cloudpress.app.mjs";

export default {
  props: {
    cloudpress,
    db: "$.service.db",
    http: "$.interface.http",
    connectionIds: {
      propDefinition: [
        cloudpress,
        "connectionIds",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.cloudpress.createWebhook({
        data: {
          connections: this.connectionIds,
          endpoint: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.cloudpress.deleteWebhook({
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
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.eventTime);
    this.$emit(body, {
      id: ts,
      summary: this.getSummary(body),
      ts,
    });
  },
};
