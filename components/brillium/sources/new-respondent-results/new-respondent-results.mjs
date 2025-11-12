import common from "../common/base.mjs";

export default {
  ...common,
  key: "brillium-new-respondent-results",
  name: "New Respondent Results",
  description: "Emit new event when new results are added for an existing respondent. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01073)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    respondentId: {
      propDefinition: [
        common.props.brillium,
        "respondentId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.brillium.listRespondentResults;
    },
    getArgs() {
      return {
        respondentId: this.respondentId,
      };
    },
    getResourceKey() {
      return "Results";
    },
    getTsField() {
      return "DateAnswered";
    },
    generateMeta(result) {
      return {
        id: result.Id,
        summary: `New Results with ID: ${result.Id}`,
        ts: Date.parse(result[this.getTsField()]),
      };
    },
  },
};
