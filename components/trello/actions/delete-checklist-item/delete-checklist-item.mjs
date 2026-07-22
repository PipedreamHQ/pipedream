import app from "../../trello.app.mjs";

export default {
  key: "trello-delete-checklist-item",
  name: "Delete Checklist Item",
  description: "Deletes a checklist item from a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checkitem-idcheckitem-delete).",
  version: "0.0.1",
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
      description: "The ID of the checklist",
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

    await this.app.deleteChecklistItem({
      $,
      cardId,
      checklistItemId,
    });

    $.export("$summary", `Successfully deleted checklist item with ID: ${checklistItemId}`);
  },
};
