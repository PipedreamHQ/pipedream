import common from "../common/task-props.mjs";

export default {
  key: "clickup-get-task",
  name: "Get Task",
  description: "Get a task. See the docs [here](https://clickup.com/api) in **Tasks  / Get Task** section.",
  version: "0.0.2",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { taskId } = this;

    const response = await this.clickup.getTask({
      $,
      taskId,
    });

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
