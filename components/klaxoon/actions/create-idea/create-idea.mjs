import app from "../../klaxoon.app.mjs";

export default {
  name: "Create Idea",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "klaxoon-create-idea",
  description: "Creates an idea. [See the documentation](https://developers.klaxoon.com/reference/v1boardideapost)",
  type: "action",
  props: {
    app,
    boardId: {
      propDefinition: [
        app,
        "boardId",
      ],
      description: "ID of the board where de idea will be created",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of idea",
    },
    x: {
      type: "integer",
      label: "X",
      description: "X-axis coordinate on the board",
    },
    y: {
      type: "integer",
      label: "Y",
      description: "Y-axis coordinate on the board",
    },
    z: {
      type: "integer",
      label: "Z",
      description: "Z-axis coordinate on the board",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createIdea({
      $,
      boardId: this.boardId,
      data: {
        position: {
          x: this.x,
          z: this.z,
          y: this.y,
        },
        data: {
          content: this.content,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created idea with ID \`${response.id}\``);
    }

    return response;
  },
};
