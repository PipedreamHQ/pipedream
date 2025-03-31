import common from "../common/base.mjs";

export default {
  ...common,
  key: "brillium-new-respondent",
  name: "New Respondent",
  description: "Emit new event when a new respondent completes an exam, test, quiz, or survey. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01061)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    assessmentId: {
      propDefinition: [
        common.props.brillium,
        "assessmentId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.assessmentId
        ? this.brillium.listAssessmentRespondents
        : this.brillium.listRespondents;
    },
    getArgs() {
      return this.assessmentId
        ? {
          assessmentId: this.assessmentId,
        }
        : {
          accountId: this.accountId,
        };
    },
    getResourceKey() {
      return "Respondents";
    },
    getTsField() {
      return "DateStarted";
    },
    generateMeta(respondent) {
      return {
        id: respondent.Id,
        summary: `New Respondent: ${respondent.FirstName} ${respondent.LastName}`,
        ts: Date.parse(respondent[this.getTsField()]),
      };
    },
  },
};
