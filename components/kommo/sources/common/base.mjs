import kommo from "../../kommo.app.mjs";

export default {
  props: {
    kommo,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    generateMeta(body) {
      return {
        id: body["contacts[add][0][id]"],
        summary: this.getSummary(body),
        ts: Date.parse(body["contacts[add][0][created_at]"]),
      };
    },
  },
  hooks: {
    async activate() {
      await this.kommo.createWebhook({
        data: {
          destination: this.http.endpoint,
          settings: this.getEvents(),
        },
      });
    },
    async deactivate() {
      return await this.kommo.deleteWebhook({
        data: {
          destination: this.http.endpoint,
        },
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.$emit(body, this.generateMeta(body));

  },
};
