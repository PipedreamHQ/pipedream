import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-task-comment",
  name: "Get Task Comment",
  description: "Returns info about a task comment. [See the docs here](https://developer.todoist.com/rest/v2/#get-a-comment)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    commentId: {
      propDefinition: [
        todoist,
        "commentId",
        (c) => ({
          task: c.task,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.todoist.getComments({
      $,
      params: {
        comment_id: this.commentId,
      },
    });
    $.export("$summary", "Successfully retrieved comment");
    return resp;
  },
};
