import app from "../../onenote.app.mjs";

export default {
  name: "Create Page",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "onenote-create-page",
  description: "Creates a page. [See the documentation](https://learn.microsoft.com/en-us/graph/api/section-post-pages?view=graph-rest-1.0&tabs=http)",
  type: "action",
  props: {
    app,
    sectionId: {
      propDefinition: [
        app,
        "sectionId",
      ],
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML code to create the page",
    },
  },
  async run({ $ }) {
    const response = await this.app.createPage({
      $,
      sectionId: this.sectionId,
      data: this.html,
      headers: {
        "Content-Type": "text/html",
      },
    });

    if (response) {
      $.export("$summary", `Successfully created page with ID \`${response.id}\``);
    }

    return response;
  },
};
