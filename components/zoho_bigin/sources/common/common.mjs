import app from "../../zoho_bigin.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    getWebhookEventTypes() {
      throw new Error("getWebhookEventTypes is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
    async deploy(event) {
      throw new Error("deploy is not implemented", event);
    },
  },
  hooks: {
    async deploy() {
      await this.deploy();
    },
    async activate() {
      const { users } = await this.app.getUsers({
        params: {
          type: "CurrentUser",
        },
      });

      await this.app.createWebhook({
        data: {
          watch: [
            {
              notify_url: this.http.endpoint,
              events: this.getWebhookEventTypes(),
              channel_id: users[0].id,
            },
          ],
        },
      });
    },
    async deactivate() {
      const { users } = await this.app.getUsers({
        params: {
          type: "CurrentUser",
        },
      });

      await this.app.removeWebhook({
        data: {
          watch: [
            {
              events: this.getWebhookEventTypes(),
              channel_id: users[0].id,
            },
          ],
        },
      });
    },
  },
  async run(event) {
    await this.emitEvent(event.body);
  },
};
