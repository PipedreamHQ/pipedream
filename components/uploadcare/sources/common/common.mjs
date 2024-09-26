import uploadcare from "../../uploadcare.app.mjs";

export default {
  props: {
    uploadcare,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    getWebhookEventType() {
      throw new Error("getWebhookEventType is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
    deploy() {
      throw new Error("deploy is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.deploy();
    },
    async activate() {
      await this.uploadcare.createWebhook({
        data: {
          event: this.getWebhookEventType(),
          target_url: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      await this.uploadcare.removeWebhook({
        data: {
          target_url: this.http.endpoint,
        },
      });
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
