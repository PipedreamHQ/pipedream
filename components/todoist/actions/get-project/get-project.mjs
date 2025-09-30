import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-project",
  name: "Get Project",
  description: "Returns info about a project. [See the docs here](https://developer.todoist.com/rest/v2/#get-a-project)",
  version: "0.0.4",
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
