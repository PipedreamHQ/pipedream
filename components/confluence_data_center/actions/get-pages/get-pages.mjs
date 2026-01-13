import confluenceDataCenter from "../../confluence_data_center.app.mjs";

export default {
  key: "confluence_data_center-get-pages",
  name: "Get Pages",
  description: "Retrieve a list of pages in Confluence Data Center. [See the documentation](https://developer.atlassian.com/server/confluence/rest/v1022/api-group-content-resource/#api-rest-api-content-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    confluenceDataCenter,
    spaceKey: {
      propDefinition: [
        confluenceDataCenter,
        "spaceKey",
      ],
      optional: true,
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
    const response = await this.confluenceDataCenter.listContent({
      $,
      params: {
        spaceKey: this.spaceKey,
        limit: this.limit,
        start: this.start,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.results.length} page${response.results.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
