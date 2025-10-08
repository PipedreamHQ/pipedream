import tettra from "../../tettra.app.mjs";

export default {
  key: "tettra-suggest-page",
  name: "Suggest Page",
  description: "Creates a new page suggestion in Tettra. [See the documentation](https://support.tettra.co/api-overview/api-endpoint-suggest-a-new-page)",
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
      description: "Title of the page suggestion",
    },
    description: {
      type: "string",
      label: "Description",
      description: "More context about the suggested page",
      optional: true,
    },
    category: {
      propDefinition: [
        tettra,
        "categoryId",
      ],
    },
    assignableId: {
      propDefinition: [
        tettra,
        "userId",
      ],
      label: "Assignable ID",
      description: "Select a user to assign the suggestion, or provide a user ID",
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
