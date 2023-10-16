import formbricks from "../../formbricks.app.mjs";

export default {
  key: "formbricks-response-created",
  name: "Response Created",
  description: "Emit new event when a response is created for a survey. [See the documentation](https://formbricks.com/docs/api/management/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    formbricks,
    http: "$.interface.http",
    db: "$.service.db",
    surveyIds: {
      propDefinition: [
        formbricks,
        "surveyIds",
      ],
    },
  },
  methods: {
    getTriggers() {
      return [
        "responseCreated",
      ];
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(value) {
      this.db.set("webhookId", value);
    },
  },
  hooks: {
    async activate() {
      const data = {
        triggers: this.getTriggers(),
        url: this.http.endpoint,
      };

      const { id } = await this.formbricks.createWebhook(data);
      this._setWebhookId(id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.formbricks.deleteWebhook({
        id,
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-api-key"] !== this.formbricks.$auth.api_key) {
      return;
    }
    if (this.surveyIds.length > 0 && !this.surveyIds.includes(body.data.surveyId)) {
      return;
    }
    this.$emit(body, {
      id: body.data.id,
      summary: `New response for survey: ${body.data.surveyId}`,
      ts: Date.parse(body.data.createdAt),
    });
  },
};
