import streak from "../../streak.app.mjs";

export default {
  props: {
    streak,
    db: "$.service.db",
    http: "$.interface.http",
    pipelineId: {
      propDefinition: [
        streak,
        "pipelineId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getHistoricalEvents(25);
      if (!events || events.length === 0) {
        return;
      }
      for (const item of events) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.streak.deleteWebhook({
        id: hookId,
      });
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    shortenKey(key) {
      return key.slice(-72);
    },
    getHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    for (const item of body) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
