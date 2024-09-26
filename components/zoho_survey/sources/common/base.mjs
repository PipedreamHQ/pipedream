import zohoSurvey from "../../zoho_survey.app.mjs";

export default {
  props: {
    zohoSurvey,
    db: "$.service.db",
    http: "$.interface.http",
    portalId: {
      propDefinition: [
        zohoSurvey,
        "portalId",
      ],
    },
    groupId: {
      propDefinition: [
        zohoSurvey,
        "groupId",
        (c) => ({
          portalId: c.portalId,
        }),
      ],
    },
    surveyId: {
      propDefinition: [
        zohoSurvey,
        "surveyId",
        (c) => ({
          portalId: c.portalId,
          groupId: c.groupId,
        }),
      ],
    },
    triggerName: {
      type: "string",
      label: "Trigger Name",
      description: "Trigger name to be displayed within Zoho Survey (Maximum 255 characters)",
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.zohoSurvey.createWebhook({
        portalId: this.portalId,
        groupId: this.groupId,
        surveyId: this.surveyId,
        data: {
          name: this.triggerName,
          event: this.getEvent(),
          callbackUrl: this.http.endpoint,
          responseContentType: "json",
          responseFormat: "variables",
          surveyId: this.surveyId,
          departmentId: this.groupId,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.zohoSurvey.deleteWebhook({
          portalId: this.portalId,
          groupId: this.groupId,
          surveyId: this.surveyId,
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    formatResponse(body) {
      return body;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const response = await this.formatResponse(body);
    const meta = this.generateMeta(response);
    this.$emit(response, meta);
  },
};
