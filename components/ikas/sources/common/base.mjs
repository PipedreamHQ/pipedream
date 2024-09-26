import ikas from "../../ikas.app.mjs";

export default {
  props: {
    ikas,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    alert: {
      type: "alert",
      alertType: "warning",
      content: "Please note that you can have only one webhook of each type at the same time, any change will overwrite the current webhook configuration.",
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      return this.db.set("webhookId", webhookId);
    },
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
      this._setWebhookId(data.saveWebhook[0].id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
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
    const data = JSON.parse(body.data);
    body.data = data;

    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(data),
      ts: Date.parse(body.createdAt),
    });
  },
};
