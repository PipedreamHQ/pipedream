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
    _getChallenge() {
      return this.db.get("challenge");
    },
    _setChallenge(challenge) {
      this.db.set("challenge", challenge);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    isRelevant() {
      return true;
    },
    respond() {
      this.http.respond({
        status: 200,
        body: {
          challenge: this._getChallenge(),
        },
      });
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
      this._setChallenge(body.verify.challenge);
      this.respond();
      return;
    }

    this.respond();

    const item = this.getItem(body);
    if (this.isRelevant(item)) {
      this.emitEvent(item);
    }
  },
};
