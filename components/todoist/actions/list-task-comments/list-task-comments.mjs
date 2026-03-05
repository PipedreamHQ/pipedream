import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-task-comments",
  name: "List Task Comments",
  description: "Returns a list of comments for a task. [See the documentation](https://developer.todoist.com/api/v1#tag/Comments/operation/get_comments_api_v1_comments_get)",
  version: "0.0.7",
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
    $.export("$summary", `Successfully retrieved ${resp?.results?.length} comment${resp?.results?.length === 1
      ? ""
      : "s"}`);
    return resp?.results;
  },
};
