import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_pages-get-page",
  name: "Get Page",
  description: "Retrieves a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/page)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  async run({ $ }) {
    const pages = await this.facebookPages.listAllPages({
      $,
    });
    const page = pages.find(({ id }) => id == this.page);

    $.export("$summary", `Successfully retrieved page with ID ${this.page}`);

    return page;
  },
};
