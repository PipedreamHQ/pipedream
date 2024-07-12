import ikas from "../../ikas.app.mjs";

export default {
  props: {
    ikas,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { data } = await this.ikas.makeRequest({
        data: {
          "query": `mutation {
          saveWebhook(
            input: {
              scopes: "${this.getScope()}"
              endpoint: "${this.http.endpoint}"
            }
          ) {
            createdAt
            deleted
            endpoint
            id
            scope
            updatedAt
          }
        }`,
        },
      });
      this.db.set("webhookId", data.saveWebhook[0].id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.ikas.makeRequest({
          data: {
            "query": `mutation {
            deleteWebhook(scopes: ["${this.getScope()}"])
          }`,
          },
        });
      }
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: Date.parse(body.createdAt),
    });
  },
};
