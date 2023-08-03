import common from "../common/common.mjs";

export default {
  key: "asana-get-tasks-from-task-list",
  name: "Get Tasks From Task List",
  description: "Returns the compact list of tasks in a user’s My Tasks list.. [See the documentation](https://developers.asana.com/reference/gettasksforusertasklist)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
  },
  async run({ $ }) {
    const response = await this.asana.getTasksFromUserTaskList({
      workspace: this.workspace,
      project: this.project,
      userId: this.userId,
    }, $);

    $.export("$summary", `Successfully retrieved ${response.length} tasks`);

    return response;
  },
};
