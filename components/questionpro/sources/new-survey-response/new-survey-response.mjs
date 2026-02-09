import questionpro from "../../questionpro.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "questionpro-new-survey-response",
  name: "New Survey Response (Instant)",
  version: "0.0.1",
  description: "Emit new event when a new survey response is received. [See the documentation](https://www.questionpro.com/api/create-webhook.html)",
  type: "source",
  dedupe: "unique",
  props: {
    questionpro,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    organizationId: {
      propDefinition: [
        questionpro,
        "organizationId",
      ],
    },
    userId: {
      propDefinition: [
        questionpro,
        "userId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
      description: "The ID of the user who owns the survey",
    },
    surveyId: {
      propDefinition: [
        questionpro,
        "surveyId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the webhook",
    },
  },
  hooks: {
    async activate() {
      const { response } = await this.questionpro.createWebhook({
        surveyId: this.surveyId,
        data: {
          description: this.description,
          requestURL: this.http.endpoint,
          requestHeader: "",
          requestJSON: "{complete_response}",
          requestMethod: "METHOD_POST",
          location: "LOCATION_AFTER_SURVEY",
          type: 1,
        },
      });
      this._setWebhookId(response.webhookID);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.questionpro.deleteWebhook({
          surveyId: this.surveyId,
          webhookId,
        });
      }
    },
  },
  methods: {
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (!body) {
      return;
    }

    this.$emit(body, {
      id: body.responseID,
      summary: `New survey response: ${body.responseID}`,
      ts: body.utctimestamp,
    });
  },
  sampleEmit,
};
