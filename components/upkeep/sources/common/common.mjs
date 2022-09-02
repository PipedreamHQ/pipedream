import app from "../../upkeep.app.mjs";

export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
    getEvents() {
      throw new Error("getEvents is not implemented!");
    },
    getTitle() {
      throw new Error("getTitle is not implemented!");
    },
    getSummary() {
      throw new Error("getSummary is not implemented!");
    },
    getTime() {
      throw new Error("getTime is not implemented!");
    },
  },
  hooks: {
    async activate() {
      const { webhookId } = await this.app.createWebhook({
        title: this.getTitle(),
        endpoint: this.http.endpoint,
        events: this.getEvents(),
      });
      this._setHookID(webhookId);
      console.log(`Created webhook. (Hook ID: ${webhookId}, endpoint: ${this.http.endpoint})`);
    },
    async deactivate() {
      await this.app.deleteWebhook({
        webhookId: this._getHookID(),
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
    this.$emit(
      event,
      {
        summary: this.getSummary(event.body),
        id: event.body?.id,
        ts: this.getTime(),
      },
    );
  },
};
