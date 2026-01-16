import cloudcart from "../../cloudcart.app.mjs";

export default {
  props: {
    cloudcart,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { data: { id } } = await this.cloudcart.createWebhook({
        data: {
          data: {
            type: "webhooks",
            attributes: {
              url: this.http.endpoint,
              event: this.getEvent(),
              ...this.getWebhookArgs(),
            },
          },
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.cloudcart.deleteWebhook(hookId);
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
    getWebhookArgs() {
      return {};
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;

    if (!body) {
      return;
    }

    const meta = this.generateMeta(body[0]);
    this.$emit(body[0], meta);
  },
};
