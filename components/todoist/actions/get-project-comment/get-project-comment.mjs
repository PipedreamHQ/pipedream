import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-project-comment",
  name: "Get Project Comment",
  description: "Returns info about a project comment [See the docs here](https://developer.todoist.com/rest/v1/#get-a-comment)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    commentId: {
      propDefinition: [
        todoist,
        "commentId",
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
