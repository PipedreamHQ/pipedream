import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  name: "New Survey",
  version: "0.0.1",
  type: "source",
  key: "survey_monkey-new-survey",
  description: "Triggers when a new survey is created",
  props: {
    surveyMonkey,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const hookId = await this.surveyMonkey.createHook(this.http.endpoint);
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
      summary: `Survey created - ${event.body.object_id}`,
      ts: Date.now(),
    });
  },
};
