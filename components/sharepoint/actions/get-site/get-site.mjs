import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-get-site",
  name: "Get Site",
  description:
    "Retrieve a site by its identifier."
    + " This is a direct path/ID lookup, so it's immediately consistent and returns newly created sites without indexing delay."
    + "\n\n"
    + "Use this when you know the site path; for discovery, use **Search Sites** or **List Sites**."
    + "\n\n"
    + "[See the documentation](https://learn.microsoft.com/en-us/graph/api/site-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.6",
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
