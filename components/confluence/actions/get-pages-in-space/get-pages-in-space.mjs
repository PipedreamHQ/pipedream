import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-get-pages-in-space",
  name: "Get Pages in Space",
  description: "Retrieve a list of pages in a space. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/#api-spaces-id-pages-get)",
  version: "0.0.1",
  type: "action",
  props: {
    confluence,
    spaceId: {
      propDefinition: [
        confluence,
        "spaceId",
      ],
    },
    sort: {
      propDefinition: [
        confluence,
        "pageSort",
      ],
    },
    status: {
      propDefinition: [
        confluence,
        "pageStatus",
      ],
    },
    pageTitle: {
      propDefinition: [
        confluence,
        "pageTitle",
      ],
    },
    bodyFormat: {
      propDefinition: [
        confluence,
        "bodyFormat",
      ],
    },
    subType: {
      propDefinition: [
        confluence,
        "subType",
      ],
    },
    cursor: {
      propDefinition: [
        confluence,
        "cursor",
      ],
    },
    limit: {
      propDefinition: [
        confluence,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const cloudId = await this.confluence.getCloudId({
      $,
    });
    const response = await this.confluence.listPagesInSpace({
      $,
      cloudId,
      spaceId: this.spaceId,
      params: {
        sort: this.sort,
        status: this.status,
        title: this.pageTitle,
        bodyFormat: this.bodyFormat,
        subType: this.subType,
        cursor: this.cursor,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.results.length} page${response.results.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
