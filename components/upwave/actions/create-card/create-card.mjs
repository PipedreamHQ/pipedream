import app from "../../upwave.app.mjs";

export default {
  key: "upwave-create-card",
  name: "Create Card",
  description: "Create a new card. [See the documentation](https://upwavehq.github.io/api/#creating-a-new-card)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    boardId: {
      propDefinition: [
        app,
        "boardId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    dueDt: {
      propDefinition: [
        app,
        "dueDt",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createCard({
      $,
      workspaceId: this.workspaceId,
      data: {
        board: this.boardId,
        due_dt: this.dueDt,
        description: this.description,
      },
    });
    $.export("$summary", "Successfully created card with ID: " + response.id);
    return response;
  },
};
