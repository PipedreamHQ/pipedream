import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-find-project",
  name: "Find Project",
  description: "Finds a project (by name/title). [See Docs](https://developer.todoist.com/rest/v2/#get-all-projects) Optionally, create one if none are found. [See Docs](https://developer.todoist.com/rest/v2/#create-a-new-project)",
  version: "0.0.4",
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
    const projects = await this.todoist.getProjects({
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
