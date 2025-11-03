import tettra from "../../tettra.app.mjs";

export default {
  key: "tettra-create-page",
  name: "Create Page",
  description: "Creates a new page in Tettra. [See the documentation](https://support.tettra.co/api-overview/api-endpoint-create-page)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    tettra,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the page",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the page formatted as HTML",
    },
    categoryId: {
      propDefinition: [
        tettra,
        "categoryId",
      ],
    },
    subcategoryId: {
      propDefinition: [
        tettra,
        "subcategoryId",
        ({ categoryId }) => ({
          categoryId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tettra.createPage({
      $,
      data: {
        title: this.title,
        body: this.body,
        category_id: this.categoryId,
        subcategory_id: this.subcategoryId,
      },
    });

    $.export("$summary", `Successfully created page "${this.title}"`);
    return response;
  },
};
