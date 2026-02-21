import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-project",
  name: "Get Project",
  description: "Returns info about a project. [See the documentation](https://developer.todoist.com/api/v1#tag/Projects/operation/get_project_api_v1_projects__project_id__get)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const resp = (await this.todoist.getProjects({
      $,
      id: this.project,
    }));
    $.export("$summary", "Successfully retrieved project");
    return resp;
  },
};
