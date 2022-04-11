import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes a checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists  / Delete Checklist** section.",
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
  },
  async run({ $ }) {
    const {
      taskId,
      checklistId,
    } = this;

    return this.clickup.deleteChecklist({
      $,
      taskId,
      checklistId,
    });
  },
};
