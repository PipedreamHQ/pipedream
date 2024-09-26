import klenty from "../../klenty.app.mjs";

export default {
  props: {
    klenty,
    db: "$.service.db",
    http: "$.interface.http",
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
      const { _id } = await this.klenty.createWebhook({
        data: {
          subscription_url: this.http.endpoint,
          event: this.getEvent(),
        },
      });
      this.setHookId(_id);
    },
    async deactivate() {
      const webhookId = this.getHookId();
      await this.klenty.deleteWebhook({
        data: {
          webhookId,
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.now();

    this.$emit(body, {
      id: body.email || ts,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
