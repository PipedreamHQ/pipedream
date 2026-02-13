import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-project",
  name: "Delete Project",
  description: "Deletes a project. [See the documentation](https://developer.todoist.com/api/v1#tag/Projects/operation/delete_project_api_v1_projects__project_id__delete)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
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
      optional: false,
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
