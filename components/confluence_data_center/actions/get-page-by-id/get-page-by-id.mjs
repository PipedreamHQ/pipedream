import confluenceDataCenter from "../../confluence_data_center.app.mjs";

export default {
  key: "confluence_data_center-get-page-by-id",
  name: "Get Page by ID",
  description: "Retrieve a page by its ID. [See the documentation](https://developer.atlassian.com/server/confluence/rest/v1022/api-group-content-resource/#api-rest-api-content-id-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    confluenceDataCenter,
    pageId: {
      propDefinition: [
        confluenceDataCenter,
        "contentId",
      ],
      label: "Page ID",
      description: "Select a page or provide its ID",
    },
  },
  async run({ $ }) {
    const response = await this.confluenceDataCenter.getContentById({
      $,
      id: this.pageId,
    });
    $.export("$summary", `Successfully retrieved page with ID: ${this.pageId}`);
    return response;
  },
};
