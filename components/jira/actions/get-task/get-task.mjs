import base from "../common/base.mjs";

export default {
  ...base,
  key: "jira-get-task",
  name: "Get Task",
  description: "Gets the status of a long-running asynchronous task. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-tasks/#api-rest-api-3-task-taskid-get)",
  version: "0.2.0",
  type: "action",
  props: {
    ...base.props,
    taskId: {
      label: "Task ID",
      description: "The ID of the task",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.jira.getTask({
      $,
      cloudId: this.cloudId,
      taskId: this.taskId,
    });

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
