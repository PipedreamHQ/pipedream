import formbricks from "../../formbricks.app.mjs";

export default {
  key: "formbricks-response-created",
  name: "Response Created",
  description: "Emit new event when a new response is created for a survey. [See the documentation](https://formbricks.com/docs/api/management/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    formbricks: {
      type: "app",
      app: "formbricks",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    surveyIds: {
      propDefinition: [
        formbricks,
        "surveyIds",
      ],
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
