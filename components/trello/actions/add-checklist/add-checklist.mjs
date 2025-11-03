import app from "../../trello.app.mjs";

export default {
  key: "trello-add-checklist",
  name: "Add Checklist",
  description: "Adds a new checklist to a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checklists-post).",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    boardId: {
      propDefinition: [
        app,
        "board",
      ],
    },
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the card.",
      optional: false,
      propDefinition: [
        app,
        "cards",
        ({ boardId }) => ({
          board: boardId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Checklist Name",
      description: "The name of the checklist.",
      optional: true,
    },
    idChecklistSource: {
      optional: true,
      propDefinition: [
        app,
        "checklist",
        ({ boardId }) => ({
          board: boardId,
        }),
      ],
      label: "Copy from Checklist",
    },
    pos: {
      propDefinition: [
        app,
        "pos",
      ],
    },
  },
  async run({ $ }) {
    const {
      cardId,
      name,
      idChecklistSource,
      pos,
    } = this;

    const response = await this.app.addChecklist({
      $,
      cardId,
      params: {
        name,
        idChecklistSource,
        pos,
      },
    });

    $.export("$summary", `Successfully added checklist with ID: ${response.id}`);

    return response;
  },
};
