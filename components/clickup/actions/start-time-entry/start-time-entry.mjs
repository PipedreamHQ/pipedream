import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-start-time-entry",
  name: "Start Time Entry",
  description: "Start time entry. [See the documentation](https://clickup.com/api/clickupreference/operation/StartatimeEntry)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    description: {
      label: "Description",
      description: "Description of the time entry",
      type: "string",
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
      optional: true,
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
  },
  async run({ $ }) {
    const response = await this.clickup.startTimeEntry({
      $,
      teamId: this.workspaceId,
      params: {
        custom_task_ids: this.useCustomTaskIds,
      },
      data: {
        tid: this.taskId,
        description: this.description,
      },
    });

    $.export("$summary", "Successfully started time entry");

    return response;
  },
};
