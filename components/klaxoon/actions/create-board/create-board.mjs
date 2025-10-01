import app from "../../klaxoon.app.mjs";

export default {
  name: "Create Board",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "klaxoon-create-board",
  description: "Creates a board. [See the documentation](https://developers.klaxoon.com/reference/v1boardpost)",
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the board",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the board",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createBoard({
      $,
      data: {
        title: this.title,
        description: this.description,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created board with ID \`${response.id}\``);
    }

    return response;
  },
};
