import surveyMonkey from "../../survey_monkey.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Survey Response",
  version: "0.0.2",
  type: "source",
  key: "survey_monkey-new-survey-response",
  description: "Emit new survey response",
  props: {
    ...common.props,
    survey: {
      propDefinition: [
        surveyMonkey,
        "survey",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const hookId = await this.surveyMonkey.createHook(
        this.http.endpoint,
        this.survey,
      );
      this.setHookId(hookId);
    },
  },
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New response from survey - ${event.body.object_id}`;
    },
  },
};
