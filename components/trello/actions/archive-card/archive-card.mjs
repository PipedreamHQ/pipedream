import app from "../../trello.app.mjs";

export default {
  key: "trello-archive-card",
  name: "Archive Card",
  description: "Archives a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put).",
  version: "0.2.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    board: {
      propDefinition: [
        app,
        "board",
      ],
    },
    cardId: {
      propDefinition: [
        app,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the Card to archive",
      optional: false,
    },
  },
  async run({ $ }) {
    const res = await this.app.updateCard({
      $,
      cardId: this.cardId,
      data: {
        closed: true,
      },
    });
    $.export("$summary", `Successfully archived card ${this.cardId}`);
    return res;
  },
};
