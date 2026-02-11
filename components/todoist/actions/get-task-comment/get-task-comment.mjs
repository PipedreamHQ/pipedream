import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-task-comment",
  name: "Get Task Comment",
  description: "Returns info about a task comment. [See the documentation](https://developer.todoist.com/api/v1#tag/Comments/operation/get_comment_api_v1_comments__comment_id__get)",
  version: "0.0.5",
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
