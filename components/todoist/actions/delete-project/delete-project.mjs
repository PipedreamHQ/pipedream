import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-project",
  name: "Delete Project",
  description: "Deletes a project. [See the docs here](https://developer.todoist.com/rest/v1/#delete-a-project)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
  },
  async run ({ $ }) {
    const { project } = this;
    const data = {
      projectId: project,
    };
    // No interesting data is returned from Todoist
    await this.todoist.deleteProject({
      $,
      data,
    });
    $.export("$summary", "Successfully deleted project");
    return {
      id: project,
      success: true,
    };
  },
};
