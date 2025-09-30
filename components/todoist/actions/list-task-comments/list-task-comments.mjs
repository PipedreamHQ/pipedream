import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-task-comments",
  name: "List Task Comments",
  description: "Returns a list of comments for a task. [See the docs here](https://developer.todoist.com/rest/v2/#get-all-comments)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const params = {
      task_id: this.task,
    };
    const resp = await this.todoist.getComments({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${resp.length} comment${resp.length === 1
      ? ""
      : "s"}`);
    return resp;
  },
};
