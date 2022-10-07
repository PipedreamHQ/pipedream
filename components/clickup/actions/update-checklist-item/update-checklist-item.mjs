import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-update-checklist-item",
  name: "Update Checklist Item",
  description: "Updates item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists  / Edit Checklist Item** section.",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
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
    useCustomTaskIds: {
      propDefinition: [
        clickup,
        "useCustomTaskIds",
      ],
    },
    authorizedTeamId: {
      propDefinition: [
        clickup,
        "authorizedTeamId",
      ],
    },
    taskId: {
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
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
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
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
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of item",
    },
    assignee: {
      label: "Assignee",
      type: "string",
      propDefinition: [
        clickup,
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
    parent: {
      label: "Checklist Parent",
      description: "Set another checklist as parent",
      propDefinition: [
        clickup,
        "checklistItems",
        (c) => ({
          taskId: c.taskId,
          checklistId: c.checklistId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
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
