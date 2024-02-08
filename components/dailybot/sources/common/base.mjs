import dailybot from "../../dailybot.app.mjs";

export default {
  props: {
    dailybot,
    db: "$.service.db",
    http: "$.interface.http",
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
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const response = await this.dailybot.createHook({
        data: {
          name: `Pipedream - ${new Date().getTime()}`,
          subscriptions: this.getEvent(),
          hook_url: this.http.endpoint,
          immediate_sample_event: true,
        },
      });

      this._setHookId(response.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.dailybot.deleteHook({
        data: {
          hook_id: hookId,
          hook_url: this.http.endpoint,
        },
      });
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
