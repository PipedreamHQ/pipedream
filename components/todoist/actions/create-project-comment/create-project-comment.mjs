import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-project-comment",
  name: "Create Project Comment",
  description: "Adds a comment to a project. [See the docs here](https://developer.todoist.com/rest/v1/#create-a-new-comment)",
  version: "0.0.1",
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
