import common from "../common/task-props.mjs";

export default {
  key: "clickup-get-task-comments",
  name: "Get Task Comments",
  description: "Get a task comments. See the docs [here](https://clickup.com/api) in **Comments / Get Task Comments** section.",
  version: "0.0.3",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { taskId } = this;

    const response = await this.clickup.getTaskComments({
      $,
      taskId,
    });

    $.export("$summary", "Successfully retrieved task comments");

    return response;
  },
};
