import printful_oauth from "../../printful_oauth.app.mjs";

export default {
  props: {
    printful_oauth,
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
    deploy(event) {
      throw new Error("deploy is not implemented", event);
    },
  },
  hooks: {
    async deploy() {
      await this.deploy();
    },
    async activate() {
      await this.printful_oauth.createWebhook({
        data: {
          url: this.http.endpoint,
          types: [
            this.getWebhookEventType(),
          ],
        },
      });
    },
    async deactivate() {
      await this.printful_oauth.removeWebhook();
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
