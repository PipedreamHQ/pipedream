import common from "../common/base.mjs";

export default {
  ...common,
  key: "brillium-new-question-added",
  name: "New Question Added",
  description: "Emit new event when a new question is added to an assessment in Brillium. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01071)",
  version: "0.0.3",
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
    },
    topicId: {
      propDefinition: [
        common.props.brillium,
        "topicId",
        (c) => ({
          assessmentId: c.assessmentId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.topicId
        ? this.brillium.listTopicQuestions
        : this.brillium.listQuestions;
    },
    getArgs() {
      return this.topicId
        ? {
          topicId: this.topicId,
        }
        : {
          assessmentId: this.assessmentId,
        };
    },
    getResourceKey() {
      return "Questions";
    },
    getTsField() {
      return "Id";
    },
    generateMeta(question) {
      return {
        id: question.Id,
        summary: `New Question with ID: ${question.Id}`,
        ts: Date.now(),
      };
    },
  },
};
