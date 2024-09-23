import twoChat from "../../_2chat.app.mjs";

export default {
  props: {
    twoChat,
    db: "$.service.db",
    http: "$.interface.http",
    fromNumber: {
      propDefinition: [
        twoChat,
        "fromNumber",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data: { uuid } } = await this.twoChat.createWebhook({
        event: this.getEvent(),
        data: {
          hook_url: this.http.endpoint,
          on_number: this.fromNumber,
          ...this.getWebhookParams(),
        },
      });
      this._setHookId(uuid);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.twoChat.deleteWebhook({
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
    getWebhookParams() {
      return {};
    },
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
