import dialpad from "../app/dialpad.app";

export default {
  props: {
    dialpad,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getPayload() {
      return null;
    },
    async createWebHook(path, data) {
      return this.dialpad.createWebhook({
        path,
        hook_url: this.http.endpoint,
        data,
      });
    },
    async deactivateMain(path) {
      const webhookId = this._getWebhookId();
      return this.dialpad.removeWebhook({
        path,
        webhookId,
      });
    },
  },
  hooks: {
    async activate() {
      const path = this.getPath();
      const data = this.getPayload();
      const response = await this.createWebHook(path, data);
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const path = this.getPath();
      await this.deactivateMain(path);
    },
  },
  async run(event) {
    this.processEvent(event);
  },
};
