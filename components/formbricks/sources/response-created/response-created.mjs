import formbricks from "../../formbricks.app.mjs";

export default {
  key: "formbricks-response-created",
  name: "Response Created",
  description:
    "Emit new event when a response is created for a survey. [See the documentation](https://formbricks.com/docs/api/management/webhooks)",
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
        surveyIds: this.surveyIds,
        triggers: this.getTriggers(),
        url: this.http.endpoint,
      };

      const { id } = await this.formbricks.createWebhook({
        data,
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this.formbricks.deleteWebhook({
          id,
        });
      }
    },
  },
  async run({ body }) {
    const { data } = body;
    if (data) {
      this.$emit(body, {
        id: data.id,
        summary: `New response by ${
          data.personAttributes?.email ??
          data.person?.attributes?.email ??
          "(unknown user)"
        }`,
        ts: Date.parse(data.createdAt),
      });
    }
  },
};
