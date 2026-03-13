import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-get-site",
  name: "Get Site",
  description: "Get a site in Microsoft Sharepoint. [See the documentation](https://learn.microsoft.com/en-us/graph/api/site-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    select: {
      propDefinition: [
        sharepoint,
        "select",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sharepoint.getSite({
      $,
      siteId: this.siteId,
      params: {
        select: this.select,
      },
    });
    $.export("$summary", `Successfully retrieved site with ID: ${this.siteId}`);
    return response;
  },
};
