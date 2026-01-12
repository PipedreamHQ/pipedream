import confluenceDataCenter from "../../confluence_data_center.app.mjs";

export default {
  key: "confluence_data_center-search-content",
  name: "Search Content",
  description: "Search for content in Confluence Data Center. [See the documentation](https://developer.atlassian.com/server/confluence/rest/v1022/api-group-content-resource/#api-rest-api-content-search-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    confluenceDataCenter,
    cql: {
      type: "string",
      label: "CQL",
      description: "The CQL query to be used for the search. See [Advanced Searching using CQL](https://developer.atlassian.com/cloud/confluence/advanced-searching-using-cql/) for instructions on how to build a CQL query.",
    },
    limit: {
      propDefinition: [
        confluenceDataCenter,
        "limit",
      ],
    },
    start: {
      propDefinition: [
        confluenceDataCenter,
        "start",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.confluenceDataCenter.searchContent({
      $,
      params: {
        cql: this.cql,
        limit: this.limit,
        start: this.start,
      },
    });
    $.export("$summary", `Successfully found ${response.results.length} result${response.results.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
