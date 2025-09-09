import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-get-page-by-id",
  name: "Get Page by ID",
  description: "Retrieve a page by its ID. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/#api-pages-id-get)",
  version: "0.0.1",
  type: "action",
  props: {
    confluence,
    pageId: {
      propDefinition: [
        confluence,
        "pageId",
      ],
    },
  },
  async run({ $ }) {
    const cloudId = await this.confluence.getCloudId({
      $,
    });
    const response = await this.confluence.getPageById({
      $,
      cloudId,
      pageId: this.pageId,
    });
    $.export("$summary", `Successfully retrieved page with ID: ${this.pageId}`);
    return response;
  },
};
