import app from "../../trello.app.mjs";

export default {
  key: "trello-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes the specified checklist. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-id-delete).",
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
    carId: {
      propDefinition: [
        app,
        "cards",
        (c) => ({
          board: c.board,
          checklistCardsOnly: true,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the card containing the checklist do delete",
      optional: false,
    },
    checklistId: {
      propDefinition: [
        app,
        "checklist",
        ({ carId }) => ({
          card: carId,
        }),
      ],
      description: "The ID of the checklist to delete",
    },
  },
  async run({ $ }) {
    await this.app.deleteChecklist({
      $,
      checklistId: this.checklistId,
    });
    $.export("$summary", `Successfully deleted checklist ${this.checklistId}`);
  },
};
