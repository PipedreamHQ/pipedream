import base from "../common/base.mjs";

export default {
  ...base,
  key: "qualaroo-survey-created",
  name: "New Survey Created",
  description: "Emit new event when a survey is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getListingFunctionOpts() {
      return {
        fn: this.qualaroo.listSurveys,
        opts: {},
      };
    },
    getMeta(survey) {
      return {
        id: survey.id,
        summary: `New survey created: ${survey.name}`,
        ts: new Date(survey.created_at),
      };
    },
  },
};
