import app from "../../trello.app.mjs";

export default {
  key: "trello-create-checklist-item",
  name: "Create a Checklist Item",
  description: "Creates a new checklist item in a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-id-checkitems-post).",
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
    card: {
      propDefinition: [
        app,
        "cards",
        ({ board }) => ({
          board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the Card that the checklist item should be added to",
      optional: false,
    },
    checklistId: {
      label: "Checklist ID",
      description: "ID of a checklist.",
      propDefinition: [
        app,
        "checklist",
        ({ card }) => ({
          card,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new check item on the checklist. Should be a string of length 1 to 16384.",
    },
    pos: {
      propDefinition: [
        app,
        "pos",
      ],
    },
    checked: {
      type: "boolean",
      label: "Checked",
      description: "Determines whether the check item is already checked when created.",
      optional: true,
    },
  },
  methods: {
    createChecklistItem({
      checklistId, ...args
    } = {}) {
      return this.app.post({
        path: `/checklists/${checklistId}/checkItems`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createChecklistItem,
      checklistId,
      name,
      pos,
      checked,
    } = this;

    const response = await createChecklistItem({
      $,
      checklistId,
      params: {
        name,
        pos,
        checked,
      },
    });

    $.export("$summary", "Successfully created a checklist item");

    return response;
  },
};
