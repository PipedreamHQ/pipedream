import app from "../../trello.app.mjs";

export default {
  key: "trello-get-cards-in-list",
  name: "Get Cards In A List",
  description: "List the cards in a list. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-lists/#api-lists-id-cards-get).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    board: {
      propDefinition: [
        app,
        "board",
      ],
      label: "Board ID",
      description: "The ID of the board containing the list",
    },
    listId: {
      propDefinition: [
        app,
        "lists",
        ({ board }) => ({
          board,
        }),
      ],
      type: "string",
      label: "List ID",
      description: "The ID of the list to get cards from",
      optional: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      listId,
    } = this;

    const response = await app.getCardsInList({
      $,
      listId,
    });

    $.export("$summary", `Successfully retrieved \`${response.length}\` card(s) from list`);
    return response;
  },
};
