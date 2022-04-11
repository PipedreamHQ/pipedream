import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-delete-checklist-item",
  name: "Delete Checklist Item",
  description: "Deletes item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists  / Delete Checklist Item** section.",
  version: "0.0.1",
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
      optional: true,
    },
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        clickup,
        "lists",
        (c) => ({
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
        }),
      ],
      optional: true,
    },
    checklistId: {
      propDefinition: [
        clickup,
        "checklists",
        (c) => ({
          taskId: c.taskId,
        }),
      ],
    },
    checklistItemId: {
      propDefinition: [
        clickup,
        "checklistItems",
        (c) => ({
          taskId: c.taskId,
          checklistId: c.checklistId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      checklistId,
      checklistItemId,
    } = this;

    return this.clickup.deleteChecklistItem({
      $,
      checklistId,
      checklistItemId,
    });
  },
};
