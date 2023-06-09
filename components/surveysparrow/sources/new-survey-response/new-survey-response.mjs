import surveySparrow from "../../surveysparrow.app.mjs";

export default {
  key: "surveysparrow-new-survey-response",
  name: "New Survey Response",
  description: "Emit new event each time a the specified survey receives a response. [See the documentation](https://developers.surveysparrow.com/rest-apis/webhooks#postV3Webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    surveySparrow,
    db: "$.service.db",
    http: "$.interface.http",
    survey: {
      propDefinition: [
        surveySparrow,
        "survey",
      ],
    },
  },
  hooks: {
    async deploy() {
      const responses = await this.surveySparrow.listResponses({
        params: {
          limit: 25,
          order: "DESC",
          survey_id: this.survey,
        },
      });
      for (const response of responses) {
        const meta = this.generateMeta(response);
        this.$emit(response, meta);
      }
    },
    async activate() {
      const hook = await this.surveySparrow.createWebhook({
        data: {
          url: this.http.endpoint,
          http_method: "POST",
          survey_id: this.survey,
        },
      });
      this._setHookId(hook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.surveySparrow.deleteWebhook({
        hookId,
      });
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(response) {
      return {
        id: response.id,
        summary: `New response from contact ${response.contact_id}.`,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    console.log(event);
  },
};
