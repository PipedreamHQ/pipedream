import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-project",
  name: "Create Project",
  description: "Creates a project. [See the documentation](https://developer.todoist.com/api/v1#tag/Projects/operation/create_project_api_v1_projects_post)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    name: {
      propDefinition: [
        todoist,
        "name",
      ],
    },
    parent: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "Optional parent project",
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
      name,
      parent,
      color,
      favorite,
    } = this;
    const data = {
      name,
      parent_id: parent,
      color,
      is_favorite: favorite,
    };
    const resp = await this.todoist.createProject({
      $,
      data,
    });
    $.export("$summary", "Successfully created project");
    return resp;
  },
};
