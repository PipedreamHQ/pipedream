import app from "../../onenote.app.mjs";

export default {
  name: "Get Page",
  description: "Retrieve the metadata of a single OneNote page (title, created and modified timestamps, parent section and notebook, OneNote client and web links) by page ID. Use **Search Pages** first to find the page ID. Use **Get Page Content** instead when you need the body of the page. [See the documentation](https://learn.microsoft.com/en-us/graph/api/page-get?view=graph-rest-1.0&tabs=http)",
  key: "onenote-get-page",
  type: "action",
  ai: "optimized",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    pageId: {
      propDefinition: [
        app,
        "pageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getPage({
      $,
      pageId: this.pageId,
    });

    $.export("$summary", `Successfully retrieved page with ID: ${this.pageId}`);

    return response;
  },
};
