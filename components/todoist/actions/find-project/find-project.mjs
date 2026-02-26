import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-find-project",
  name: "Find Project",
  description: "Finds a project (by name/title). [See the documentation](https://developer.todoist.com/api/v1#tag/Projects/operation/get_projects_api_v1_projects_get) Optionally, create one if none are found. [See the documentation](https://developer.todoist.com/api/v1#tag/Projects/operation/create_project_api_v1_projects_post)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    todoist,
    name: {
      propDefinition: [
        todoist,
        "name",
      ],
      description: "The name of the project to search for/create",
    },
    createIfNotFound: {
      propDefinition: [
        todoist,
        "createIfNotFound",
      ],
    },
  },
  async run ({ $ }) {
    const {
      name,
      createIfNotFound,
    } = this;
    const { results: projects } = await this.todoist.getProjects({
      $,
    });
    let result = projects.find((project) => project.name == name);
    let summary = result
      ? `Project '${name}' found`
      : `Project '${name}' not found`;

    if (!result && createIfNotFound) {
      result = await this.todoist.createProject({
        $,
        data: {
          name,
        },
      });
      summary += ", Project created";
    }

    $.export("$summary", summary);
    return result;
  },
};
