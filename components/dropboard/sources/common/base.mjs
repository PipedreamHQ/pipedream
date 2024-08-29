import dropboard from "../../dropboard.app.mjs";

export default {
  props: {
    dropboard,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    clientId: {
      propDefinition: [
        dropboard,
        "clientId",
      ],
      optional: true,
    },
  },
  methods: {
    getData() {
      return {};
    },
  },
  hooks: {
    async activate() {
      const data = await this.dropboard.createWebhook({
        data: {
          url: this.http.endpoint,
          clientId: this.clientId,
          ...this.getData(),
        },
        path: this.getPath(),
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.dropboard.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    const ts = Date.parse(body.created);
    this.$emit(body, {
      id: `${body.id}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
