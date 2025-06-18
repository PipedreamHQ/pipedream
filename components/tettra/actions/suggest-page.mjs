import tettra from "../tettra.app.mjs";

export default {
  key: "tettra-suggest-page",
  name: "Suggest Page",
  description: "Creates a new page suggestion in Tettra. [See the documentation](https://support.tettra.co/api-overview/api-endpoint-suggest-a-new-page)",
  version: "0.0.1",
  type: "action",
  props: {
    tettra,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the page suggestion",
    },
    description: {
      type: "string",
      label: "Description",
      description: "More context about the suggested page",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "The category to publish the page to",
      optional: true,
    },
    assignableId: {
      type: "string",
      label: "Assignable ID",
      description: "The ID of the user to assign the suggestion",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tettra.suggestPage({
      $,
      data: {
        title: this.title,
        description: this.description,
        category: this.category,
        assignable_id: this.assignableId,
      },
    });

    $.export("$summary", `Successfully created page suggestion "${this.title}"`);
    return response;
  },
};
