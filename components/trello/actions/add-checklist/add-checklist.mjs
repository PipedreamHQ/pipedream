import app from "../../trello.app.mjs";

export default {
  key: "trello-add-checklist",
  name: "Create a Checklist",
  description: "Adds a new checklist to a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checklists-post).",
  version: "0.2.0",
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
    },
    pos: {
      type: "string",
      label: "Position",
      description: "The position of the checklist on the card. One of: top, bottom, or a positive number.",
      optional: true,
    },
  },
  methods: {
    addChecklist({
      cardId, ...args
    } = {}) {
      return this.app.post({
        path: `/cards/${cardId}/checklists`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addChecklist,
      cardId,
      name,
      idChecklistSource,
      pos,
    } = this;

    const response = await addChecklist({
      $,
      cardId,
      params: {
        name,
        idChecklistSource,
        pos,
      },
    });

    $.export("$summary", "Successfully added checklist.");

    return response;
  },
};
