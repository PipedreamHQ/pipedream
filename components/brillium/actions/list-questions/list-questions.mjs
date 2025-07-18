import brillium from "../../brillium.app.mjs";

export default {
  key: "brillium-list-questions",
  name: "List Questions",
  description: "Retrieve all Questions for an Assessment. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01071)",
  version: "0.0.2",
  type: "action",
  props: {
    brillium,
    accountId: {
      propDefinition: [
        brillium,
        "accountId",
      ],
    },
    assessmentId: {
      propDefinition: [
        brillium,
        "assessmentId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    topicId: {
      propDefinition: [
        brillium,
        "topicId",
        (c) => ({
          assessmentId: c.assessmentId,
        }),
      ],
      optional: true,
    },
    page: {
      propDefinition: [
        brillium,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        brillium,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    try {
      const params = {
        page: this.page,
        pagesize: this.pageSize,
      };
      const { Questions: questions } = this.topicId
        ? await this.brillium.listTopicQuestions({
          $,
          topicId: this.topicId,
          params,
        })
        : await this.brillium.listQuestions({
          $,
          assessmentId: this.assessmentId,
          params,
        });
      if (questions?.length) {
        $.export("$summary", `Successfully retrieved ${questions.length} question${questions.length === 1
          ? ""
          : "s"}`);
      }
      return questions;
    } catch {
      $.export("$summary", "No Questions found");
    }
  },
};
