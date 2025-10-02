import app from "../../trello.app.mjs";

export default {
  key: "trello-remove-label-from-card",
  name: "Remove Card Label",
  description: "Removes label from card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-idlabel-delete).",
  version: "0.2.4",
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
      description: "The ID of the Card to remove the Label from",
      optional: false,
    },
    labelId: {
      propDefinition: [
        app,
        "label",
        (c) => ({
          board: c.board,
          card: c.cardId,
          cardLabelsOnly: true,
        }),
      ],
      description: "The ID of the Label to be removed from the card.",
    },
  },
  async run({ $ }) {
    await this.app.removeLabelFromCard({
      $,
      cardId: this.cardId,
      labelId: this.labelId,
    });
    $.export("$summary", "Successfully sent request to remove label from card.");
    return {
      success: true,
    };
  },
};
