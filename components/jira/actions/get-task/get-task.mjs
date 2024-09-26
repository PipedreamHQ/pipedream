import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-task",
  name: "Get Task",
  description: "Gets the status of a long-running asynchronous task, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-tasks/#api-rest-api-3-task-taskid-get)",
  version: "0.1.9",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to get details of. A task is a resource that represents a [long-running asynchronous tasks](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#async-operations).",
    },
  },
  async run({ $ }) {
    const response = await this.jira.getTask({
      $,
      cloudId: this.cloudId,
      taskId: this.taskId,
    });
    $.export("$summary", `Task: '${response.title}' has been retrieved.`);
    return response;
  },
};
