import brillium from "../../brillium.app.mjs";

export default {
  key: "brillium-list-assessments",
  name: "List Assessments",
  description: "Retrieve all Assessments for a Brillium account. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01063)",
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
      const { Assessments: assessments } = await this.brillium.listAssessments({
        $,
        accountId: this.accountId,
        params: {
          page: this.page,
          pagesize: this.pageSize,
        },
      });
      if (assessments?.length) {
        $.export("$summary", `Successfully retrieved ${assessments.length} assessment${assessments.length === 1
          ? ""
          : "s"}`);
      }
      return assessments;
    } catch {
      $.export("$summary", "No Assessments found");
    }
  },
};
