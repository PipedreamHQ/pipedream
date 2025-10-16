import app from "../../xola.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { userId = this.app.$auth.user_id } = this;
      const response = await this.app.createWebhook({
        userId,
        data: {
          url: this.http.endpoint,
          event: this.getEventName(),
        },
      });
      this.db.set("hookId", response.id);
      this.db.set("userId", userId);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const userId = this.db.get("userId");
      if (hookId && userId) {
        await this.app.deleteWebhook({
          userId,
          hookId,
        });
      }
    },
  },
  methods: {
    getEventName() {
      throw new Error("getEventName is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    this.http.respond({
      status: 200,
    });

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
