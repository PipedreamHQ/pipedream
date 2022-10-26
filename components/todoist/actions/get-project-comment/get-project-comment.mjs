import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-project-comment",
  name: "Get Project Comment",
  description: "Returns info about a project comment. [See the docs here](https://developer.todoist.com/rest/v1/#get-a-comment)",
  version: "0.0.2",
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "Project containing the comment",
    },
    commentId: {
      propDefinition: [
        todoist,
        "commentId",
        (c) => ({
          project: c.project,
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
