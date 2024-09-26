import digitalriver from "../../digitalriver.app.mjs";

export default {
  props: {
    digitalriver,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHookId() {
      return this.db.get("hookId");
    },
  },
  hooks: {
    async activate() {
      const { id: webhookId } = await this.digitalriver.createWebhook({
        data: {
          address: this.http.endpoint,
          types: this.getTypes(),
        },
      });
      this.setHookId(webhookId);
    },
    async deactivate() {
      const webhookId = await this.getHookId();
      await this.digitalriver.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const { body } = event;

    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: Date.parse(body.createdTime),
    });
  },
};
