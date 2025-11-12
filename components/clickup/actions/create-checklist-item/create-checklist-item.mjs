import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-create-checklist-item",
  name: "Create Checklist Item",
  description: "Creates a new item in a checklist. [See the documentation](https://clickup.com/api) in **Checklists / Create Checklist Item** section.",
  version: "0.0.13",
  annotations: {
    destructiveHint: false,
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
  },
  async run({ $ }) {
    const {
      taskId,
      checklistId,
      name,
      assignee,
    } = this;

    const response = await this.clickup.createChecklistItem({
      $,
      taskId,
      checklistId,
      data: {
        name,
        assignee,
      },
    });

    $.export("$summary", "Successfully created checklist item");

    return response;
  },
};
