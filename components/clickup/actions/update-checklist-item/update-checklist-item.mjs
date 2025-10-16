import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-update-checklist-item",
  name: "Update Checklist Item",
  description: "Updates item in a checklist. [See the documentation](https://clickup.com/api) in **Checklists / Edit Checklist Item** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      type: "string",
      description: "The name of item",
    },
    assignee: {
      label: "Assignee",
      type: "string",
      propDefinition: [
        common.props.clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    resolved: {
      label: "Resolved",
      description: "Set the item as resolved",
      type: "boolean",
      optional: true,
    },
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
          checklistId: c.checklistId,
          taskId: c.taskId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
    },
    parent: {
      propDefinition: [
        common.props.clickup,
        "checklistItemId",
        (c) => ({
          checklistId: c.checklistId,
          taskId: c.taskId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
      label: "Checklist Parent ID",
      description: "Set another checklist item as parent",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      checklistId,
      checklistItemId,
      name,
      assignee,
      resolved,
      parent,
    } = this;

    const response = await this.clickup.updateChecklistItem({
      $,
      checklistId,
      checklistItemId,
      data: {
        name,
        assignee,
        resolved,
        parent,
      },
    });

    $.export("$summary", "Successfully updated checklist item");

    return response;
  },
};
