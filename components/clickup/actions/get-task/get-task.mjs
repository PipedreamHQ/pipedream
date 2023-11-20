import common from "../common/task-props.mjs";

export default {
  key: "clickup-get-task",
  name: "Get Task",
  description: "Get a task. See the docs [here](https://clickup.com/api) in **Tasks / Get Task** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { taskId } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const response = await this.clickup.getTask({
      $,
      taskId,
      params,
    });

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
