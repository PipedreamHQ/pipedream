import confluenceDataCenter from "../../confluence_data_center.app.mjs";

export default {
  key: "confluence_data_center-delete-content",
  name: "Delete Content",
  description: "Deletes a page or blogpost in Confluence Data Center. [See the documentation](https://developer.atlassian.com/server/confluence/rest/v1022/api-group-content-resource/#api-rest-api-content-id-delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    confluenceDataCenter,
    type: {
      propDefinition: [
        confluenceDataCenter,
        "type",
      ],
    },
    contentId: {
      propDefinition: [
        confluenceDataCenter,
        "contentId",
        ({ type }) => ({
          type,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.confluenceDataCenter.deleteContent({
      $,
      id: this.contentId,
    });
    $.export("$summary", `Successfully deleted content with ID: ${this.contentId}`);
    return response;
  },
};
