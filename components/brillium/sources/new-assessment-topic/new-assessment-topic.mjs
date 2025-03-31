import common from "../common/base.mjs";

export default {
  ...common,
  key: "brillium-new-assessment-topic",
  name: "New Assessment Topic",
  description: "Emit new event when a new topic is added to an assessment in Brillium. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01063)",
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
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.brillium.listTopics;
    },
    getArgs() {
      return {
        assessmentId: this.assessmentId,
      };
    },
    getResourceKey() {
      return "QuestionGroups";
    },
    getTsField() {
      return "DateCreated";
    },
    generateMeta(topic) {
      return {
        id: topic.Id,
        summary: `New Topic: ${topic.Name}`,
        ts: Date.parse(topic[this.getTsField()]),
      };
    },
  },
};
