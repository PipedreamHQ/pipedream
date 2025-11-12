import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-delete-checklist-item",
  name: "Delete Checklist Item",
  description: "Deletes item in a checklist. [See the documentation](https://clickup.com/api) in **Checklists / Delete Checklist Item** section.",
  version: "0.0.13",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
    },
    taskId: {
      propDefinition: [
        common.props.clickup,
        "taskId",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
      description: "To show options please select a **List** first",
    },
    checklistId: {
      propDefinition: [
        common.props.clickup,
        "checklistId",
        (c) => ({
          taskId: c.taskId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
    },
    checklistItemId: {
      propDefinition: [
        common.props.clickup,
        "checklistItemId",
        (c) => ({
          taskId: c.taskId,
          checklistId: c.checklistId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      checklistId,
      checklistItemId,
    } = this;

    const response = await this.clickup.deleteChecklistItem({
      $,
      checklistId,
      checklistItemId,
    });

    $.export("$summary", "Successfully deleted checklist item");

    return response;
  },
};
