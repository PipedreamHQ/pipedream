import app from "../../trello.app.mjs";

export default {
  key: "trello-complete-checklist-item",
  name: "Complete a Checklist Item",
  description: "Completes an existing checklist item in a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checkitem-idcheckitem-put).",
  version: "0.2.0",
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
  methods: {
    completeChecklistItem({
      cardId, checklistItemId, ...args
    } = {}) {
      return this.app.put({
        path: `/cards/${cardId}/checkItem/${checklistItemId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      completeChecklistItem,
      cardId,
      checklistItemId,
    } = this;

    const response = await completeChecklistItem({
      $,
      cardId,
      checklistItemId,
      params: {
        state: "complete",
      },
    });

    $.export("$summary", "Successfully completed checklist item.");

    return response;
  },
};
