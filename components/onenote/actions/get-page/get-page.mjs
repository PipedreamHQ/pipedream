import app from "../../onenote.app.mjs";

export default {
  name: "Get Page",
  description: "Gets a page. [See the documentation](https://learn.microsoft.com/en-us/graph/api/page-get?view=graph-rest-1.0&tabs=http)",
  key: "onenote-get-page",
  type: "action",
  version: "0.0.1",
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
