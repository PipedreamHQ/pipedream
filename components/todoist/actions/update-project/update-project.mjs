import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-project",
  name: "Update Project",
  description: "Updates a project. [See the documentation](https://developer.todoist.com/api/v1#tag/Projects/operation/update_project_api_v1_projects__project_id__post)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    projectId: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "The project to update",
    },
    name: {
      propDefinition: [
        todoist,
        "name",
      ],
      optional: true,
    },
    color: {
      propDefinition: [
        todoist,
        "color",
      ],
    },
    favorite: {
      propDefinition: [
        todoist,
        "favorite",
      ],
    },
  },
  async run ({ $ }) {
    const {
      projectId,
      name,
      color,
      favorite,
    } = this;
    const data = {
      projectId,
      name,
      color,
      is_favorite: favorite,
    };
    // No interesting data is returned from Todoist
    await this.todoist.updateProject({
      $,
      data,
    });
    $.export("$summary", "Successfully updated project");
    return {
      id: projectId,
      success: true,
    };
  },
};
