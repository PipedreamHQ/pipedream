import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-update-checklist",
  name: "Update Checklist",
  description: "Updates a checklist in a task. [See the documentation](https://clickup.com/api) in **Checklists / Edit Checklist** section.",
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
      description: "The name of checklist",
    },
    position: {
      label: "Position",
      type: "integer",
      description: "The position of checklist",
      min: 0,
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
  },
  async run({ $ }) {
    const {
      checklistId,
      name,
      position,
    } = this;

    const response = await this.clickup.updateChecklist({
      $,
      checklistId,
      data: {
        name,
        position,
      },
    });

    $.export("$summary", "Successfully updated checklist");

    return response;
  },
};
