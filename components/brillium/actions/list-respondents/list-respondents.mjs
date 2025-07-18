import brillium from "../../brillium.app.mjs";

export default {
  key: "brillium-list-respondents",
  name: "List Respondents",
  description: "Retrieve all Respondents for a Brillium account. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01061)",
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
      const { Respondents: respondents } = this.assessmentId
        ? await this.brillium.listAssessmentRespondents({
          $,
          assessmentId: this.assessmentId,
          params,
        })
        : await this.brillium.listRespondents({
          $,
          accountId: this.accountId,
          params,
        });
      if (respondents?.length) {
        $.export("$summary", `Successfully retrieved ${respondents.length} respondent${respondents.length === 1
          ? ""
          : "s"}`);
      }
      return respondents;
    } catch {
      $.export("$summary", "No Respondents found");
    }
  },
};
