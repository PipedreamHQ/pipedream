import app from "../../klaxoon.app.mjs";

export default {
  name: "Update Idea",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "klaxoon-update-idea",
  description: "Updates an idea. [See the documentation](ttps://developers.klaxoon.com/reference/v1boardideapatch)",
  type: "action",
  props: {
    app,
    boardId: {
      propDefinition: [
        app,
        "boardId",
      ],
      description: "The ID of the board where de idea will be created",
    },
    ideaId: {
      propDefinition: [
        app,
        "ideaId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      description: "ID of the idea that will be updated",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of idea",
      optional: true,
    },
    x: {
      type: "integer",
      label: "X",
      description: "X-axis coordinate on the board",
      optional: true,
    },
    y: {
      type: "integer",
      label: "Y",
      description: "Y-axis coordinate on the board",
      optional: true,
    },
    z: {
      type: "integer",
      label: "Z",
      description: "Z-axis coordinate on the board",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateIdea({
      $,
      boardId: this.boardId,
      ideaId: this.ideaId,
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
      $.export("$summary", `Successfully updated idea with ID \`${response.id}\``);
    }

    return response;
  },
};
