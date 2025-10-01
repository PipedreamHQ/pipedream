import brillium from "../../brillium.app.mjs";

export default {
  key: "brillium-list-topics",
  name: "List Topics",
  description: "Retrieve all Topics for an Assessment. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01063)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      const { QuestionGroups: topics } = await this.brillium.listTopics({
        $,
        assessmentId: this.assessmentId,
        params: {
          page: this.page,
          pagesize: this.pageSize,
        },
      });
      if (topics?.length) {
        $.export("$summary", `Successfully retrieved ${topics.length} topic${topics.length === 1
          ? ""
          : "s"}`);
      }
      return topics;
    } catch {
      $.export("$summary", "No Topics found");
    }
  },
};
