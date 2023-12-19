import common from "../common/checklist-item-props.mjs";

export default {
  key: "clickup-update-checklist-item",
  name: "Update Checklist Item",
  description: "Updates item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists / Edit Checklist Item** section.",
  version: "0.0.7",
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
    parent: {
      label: "Checklist Parent",
      description: "Set another checklist item as parent",
      propDefinition: [
        common.props.clickup,
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
