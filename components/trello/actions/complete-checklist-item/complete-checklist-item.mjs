import app from "../../trello.app.mjs";

export default {
  key: "trello-complete-checklist-item",
  name: "Complete a Checklist Item",
  description: "Completes an existing checklist item in a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checkitem-idcheckitem-put).",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
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
          checklistCardsOnly: true,
        }),
      ],
      type: "string",
      label: "Card ID",
      description: "The ID of the card.",
      optional: false,
    },
    checklistId: {
      propDefinition: [
        app,
        "checklist",
        ({ cardId }) => ({
          card: cardId,
        }),
      ],
    },
    checklistItemId: {
      propDefinition: [
        app,
        "checklistItemId",
        ({ checklistId }) => ({
          checklistId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      cardId,
      checklistItemId,
    } = this;

    const response = await this.app.completeChecklistItem({
      $,
      cardId,
      checklistItemId,
      params: {
        state: "complete",
      },
    });

    $.export("$summary", `Successfully completed checklist item with ID: ${checklistItemId}`);

    return response;
  },
};
