import surveySparrow from "../../surveysparrow.app.mjs";

export default {
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
      const { data: responses } = await this.surveySparrow.listResponses({
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
      const { data: hook } = await this.surveySparrow.createWebhook({
        data: {
          url: this.http.endpoint,
          http_method: "POST",
          survey_id: this.survey,
          payload: {
            id: "{submission_id}",
          },
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
        summary: `New response with ID ${response.id}`,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;

    const { data: response } = await this.surveySparrow.getResponse({
      responseId: body.id,
      params: {
        survey_id: this.survey,
      },
    });

    const meta = this.generateMeta(response);
    this.$emit(response, meta);
  },
};
