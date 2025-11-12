import brillium from "../../brillium.app.mjs";

export default {
  key: "brillium-list-respondent-results",
  name: "List Respondent Results",
  description: "Retrieves results for a respondent. [See the documentation](https://support.brillium.com/en-us/knowledgebase/article/KA-01073)",
  version: "0.0.4",
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
    respondentId: {
      propDefinition: [
        brillium,
        "respondentId",
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
      const { Results: results } = await this.brillium.listRespondentResults({
        $,
        respondentId: this.respondentId,
        params: {
          page: this.page,
          pagesize: this.pageSize,
        },
      });
      if (results?.length) {
        $.export("$summary", `Successfully retrieved ${results.length} result${results.length === 1
          ? ""
          : "s"}`);
      }
      return results;
    } catch {
      $.export("$summary", "No Results found");
    }
  },
};
