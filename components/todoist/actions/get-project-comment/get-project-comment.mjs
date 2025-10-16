import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-project-comment",
  name: "Get Project Comment",
  description: "Returns info about a project comment. [See the docs here](https://developer.todoist.com/rest/v2/#get-a-comment)",
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
      description: "Project containing the comment",
      optional: false,
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
