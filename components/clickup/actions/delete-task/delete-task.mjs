import common from "../common/task-props.mjs";

export default {
  key: "clickup-delete-task",
  name: "Delete Task",
  description: "Delete a task. See the docs [here](https://clickup.com/api) in **Tasks / Delete Task** section.",
  version: "0.0.3",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { taskId } = this;

    const response = await this.clickup.deleteTask({
      $,
      taskId,
    });

    $.export("$summary", "Successfully deleted task");

    return response;
  },
};
