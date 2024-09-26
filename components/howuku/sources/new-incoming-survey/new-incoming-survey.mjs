import common from "../common/base.mjs";

export default {
  ...common,
  key: "howuku-new-incoming-survey",
  name: "New Incoming Survey",
  description: "Emit new event when a new incoming survey is received. [See the documentation](https://rest.howuku.com/#survey)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.howuku.listSurveys;
    },
    generateMeta(survey) {
      const ts = Date.parse(survey.dt);
      return {
        id: `${survey.id}${ts}`,
        summary: `New response for survey: ${survey.question_id}`,
        ts,
      };
    },
  },
};
