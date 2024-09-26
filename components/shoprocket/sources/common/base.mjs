import shoprocket from "../../shoprocket.app.mjs";

export default {
  props: {
    shoprocket,
    db: "$.service.db",
    http: "$.interface.http",
    environment: {
      propDefinition: [
        shoprocket,
        "environment",
      ],
    },
  },
  hooks: {
    async activate() {
      const response = await this.shoprocket.createHook({
        data: {
          endpoint: this.http.endpoint,
          events: `${this.getSubject()}.created`,
          environment: this.environment,
        },
      });

      this.setHookId(response.data?.id);
    },
    async deactivate() {
      const webhookId = this.getHookId();
      await this.shoprocket.deleteHook(webhookId);
    },
  },
  methods: {
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHookId() {
      return this.db.get("hookId");
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: `New ${this.getSubject()} created with ID: ${body.id}`,
      ts: body.created,
    });
  },
};
