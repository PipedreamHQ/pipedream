import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-project-comment",
  name: "Create Project Comment",
  description: "Adds a comment to a project. [See the documentation](https://developer.todoist.com/api/v1#tag/Comments/operation/create_comment_api_v1_comments_post)",
  version: "0.0.6",
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
      description: "Project to add a comment to",
      optional: false,
    },
    content: {
      propDefinition: [
        todoist,
        "content",
      ],
      label: "Comment",
      optional: false,
    },
  },
  async run ({ $ }) {
    const {
      project,
      content,
    } = this;
    const data = {
      project_id: project,
      content,
    };
    const resp = await this.todoist.createComment({
      $,
      data,
    });
    $.export("$summary", "Successfully created comment");
    return resp;
  },
};
