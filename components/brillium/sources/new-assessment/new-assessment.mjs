import common from "../common/base.mjs";

export default {
  ...common,
  key: "brillium-new-assessment",
  name: "New Assessment Created",
  description: "Emit new event when a new assessment is created in Brillium. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01063)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.brillium.listAssessments;
    },
    getArgs() {
      return {
        accountId: this.accountId,
      };
    },
    getResourceKey() {
      return "Assessments";
    },
    getTsField() {
      return "DateCreated";
    },
    generateMeta(assessment) {
      return {
        id: assessment.Id,
        summary: `New Assessment: ${assessment.Name}`,
        ts: Date.parse(assessment[this.getTsField()]),
      };
    },
  },
};
