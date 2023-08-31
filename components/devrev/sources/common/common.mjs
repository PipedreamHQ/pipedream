import devrev from "../../devrev.app.mjs";

export default {
  props: {
    devrev,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { webhook } = await this.devrev.createWebhook({
        data: {
          url: this.http.endpoint,
          event_types: this.getEventTypes(),
        },
      });
      this._setHookId(webhook.id);
    },
    async deactivate() {
      const id = this._getHookId();
      await this.devrev.deleteWebhook({
        data: {
          id,
        },
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
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
    },
    getItem() {
      throw new Error("getItem is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;

    if (body?.type === "verify") {
      this.http.respond({
        status: 200,
        body: {
          challenge: body.verify.challenge,
        },
      });
      return;
    }

    const item = this.getItem(body);
    this.emitEvent(item);
  },
};
