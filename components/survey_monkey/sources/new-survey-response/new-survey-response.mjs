import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  name: "New Survey Response",
  version: "0.0.1",
  type: "source",
  key: "survey_monkey-new-survey-response",
  description: "Triggers when a new response is added",
  props: {
    surveyMonkey,
    http: "$.interface.http",
    db: "$.service.db",
    survey: {
      propDefinition: [
        surveyMonkey,
        "survey",
      ],
    },
  },
  hooks: {
    async activate() {
      const hookId = await this.surveyMonkey.createHook(
        this.http.endpoint,
        this.survey,
      );
      this.db.set("hookId", hookId);
    },
    async deactivate() {
      await this.surveyMonkey.deleteHook(this.db.get("hookId"));
    },
  },
  methods: {},
  async run(event) {
    this.http.respond({
      status: 200,
    });
    this.$emit(event, {
      summary: `New response from survey - ${event.body.object_id}`,
      ts: Date.now(),
    });
  },
};
