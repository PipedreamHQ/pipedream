import hostaway from "../../hostaway.app.mjs";

export default {
  props: {
    hostaway,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { result } = await this.hostaway.createWebhook({
        data: {
          isEnabled: 1,
          url: this.http.endpoint,
        },
      });
      this._setHookId(result.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.hostaway.deleteWebhook({
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
    isRelevant() {
      return true;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;

    this.http.respond({
      status: 200,
    });

    if (!body || body?.data === "test") return;

    const {
      event: eventType, data,
    } = body;
    if (this.isRelevant(eventType)) {
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    }
  },
};
