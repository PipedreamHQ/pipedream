import app from "../../trello.app.mjs";

export default {
  key: "trello-get-cards-on-board",
  name: "Get Cards On A Board",
  description: "Get all of the open Cards on a Board. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-cards-get).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    boardId: {
      propDefinition: [
        app,
        "board",
      ],
      label: "Board ID",
      description: "The ID of the board to get cards from",
    },
  },
  async run({ $ }) {
    const {
      app,
      boardId,
    } = this;

    const response = await app.getCards({
      $,
      boardId,
    });

    $.export("$summary", `Successfully retrieved \`${response.length}\` card(s) from board`);
    return response;
  },
};
