import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import app from "../../trello.app.mjs";

export default {
  key: "trello-update-checklist-item",
  name: "Update Checklist Item",
  description: "Updates an existing checklist item on a card, including renaming, completing, or uncompleting the item. Updates to `due`, `dueReminder`, and `idMember` require [Trello Premium](https://support.atlassian.com/trello/docs/advanced-checklists/) (advanced checklists) and may not persist on free workspaces. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-checkitem-idcheckitem-put).",
  version: "0.0.1",
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
    name: {
      type: "string",
      label: "Name",
      description: "The new name of the checklist item.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The completion state of the checklist item. Use `complete` to check the item, or `incomplete` to uncheck it.",
      optional: true,
      options: [
        "complete",
        "incomplete",
      ],
    },
    pos: {
      propDefinition: [
        app,
        "pos",
      ],
    },
    due: {
      propDefinition: [
        app,
        "due",
      ],
      description: "A due date for the checklist item. **Format: YYYY-MM-DDThh:mm:ss.sssZ**",
    },
    dueReminder: {
      type: "string",
      label: "Due Reminder",
      description: "A due reminder for the due date on the checklist item.",
      options: constants.DUE_REMINDER_OPTIONS,
      optional: true,
    },
    idMember: {
      propDefinition: [
        app,
        "member",
        ({
          board, cardId,
        }) => ({
          board,
          card: cardId,
          excludeCardMembers: true,
        }),
      ],
      label: "Member",
      description: "The ID of the member to assign to the checklist item.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      cardId,
      checklistItemId,
      name,
      state,
      pos,
      due,
      dueReminder,
      idMember,
    } = this;

    const params = {
      name,
      state,
      pos,
      due,
      dueReminder: dueReminder
        ? parseInt(dueReminder, 10)
        : undefined,
      idMember,
    };

    if (![
      name,
      state,
      pos,
      due,
      dueReminder,
      idMember,
    ].some((val) => val !== undefined && val !== null && val !== "")) {
      throw new ConfigurationError("At least one field to update must be provided (name, state, pos, due, dueReminder, or idMember).");
    }

    const response = await this.app.updateChecklistItem({
      $,
      cardId,
      checklistItemId,
      params,
    });

    $.export("$summary", `Successfully updated checklist item with ID: ${checklistItemId}`);

    return response;
  },
};
