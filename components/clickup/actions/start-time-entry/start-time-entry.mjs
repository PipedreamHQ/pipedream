import common from "../common/task-props.mjs";

export default {
  key: "clickup-start-time-entry",
  name: "Start Time Entry",
  description: "Start time entry. [See documentation here](https://clickup.com/api/clickupreference/operation/StartatimeEntry)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    description: {
      label: "Description",
      description: "Description of the time entry",
      type: "string",
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
