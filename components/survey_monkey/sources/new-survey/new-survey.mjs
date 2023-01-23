import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Survey",
  version: "0.0.2",
  type: "source",
  key: "survey_monkey-new-survey",
  description: "Emit new created survey",
  hooks: {
    ...common.hooks,
    async activate() {
      const hookId = await this.surveyMonkey.createHook(this.http.endpoint);
      this.setHookId(hookId);
    },
  },
  methods: {
    ...common.methods,
    getSummary(event) {
      return `Survey created - ${event.body.object_id}`;
    },
  },
};
