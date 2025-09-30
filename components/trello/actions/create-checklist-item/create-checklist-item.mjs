import constants from "../../common/constants.mjs";
import app from "../../trello.app.mjs";

export default {
  key: "trello-create-checklist-item",
  name: "Create a Checklist Item",
  description: "Creates a new checklist item in a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-id-checkitems-post).",
  version: "0.3.2",
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
    card: {
      propDefinition: [
        app,
        "cards",
        ({ board }) => ({
          board,
          checklistCardsOnly: true,
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
    due: {
      type: "string",
      label: "Due Date",
      description: "A due date for the checkitem. **Format: YYYY-MM-DDThh:mm:ss.sssZ**",
      optional: true,
    },
    dueReminder: {
      type: "string",
      label: "Due Reminder",
      description: "A dueReminder for the due date on the checkitem",
      options: constants.DUE_REMINDER_OPTIONS,
      optional: true,
    },
    idMember: {
      propDefinition: [
        app,
        "member",
        ({
          board, card,
        }) => ({
          board,
          card,
          excludeCardMembers: true,
        }),
      ],
      label: "Id Member",
      description: "An ID of a member resource",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      checklistId,
      name,
      pos,
      checked,
      due,
      dueReminder,
      idMember,
    } = this;

    const response = await this.app.createChecklistItem({
      $,
      checklistId,
      params: {
        name,
        pos,
        checked,
        due,
        dueReminder: dueReminder
          ? parseInt(dueReminder)
          : undefined,
        idMember,
      },
    });

    $.export("$summary", `Successfully created a checklist item with ID: ${response.id}`);

    return response;
  },
};
