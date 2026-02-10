import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-projects",
  name: "List Projects",
  description: "Returns a list of all projects. [See the documentation](https://developer.todoist.com/api/v1#tag/Projects/operation/get_projects_api_v1_projects_get)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    todoist,
  },
  async run ({ $ }) {
    const resp = await this.todoist.getProjects({
      $,
    });
    $.export("$summary", "Successfully retrieved projects");
    $.export("$summary", `Successfully retrieved ${resp?.results?.length} project${resp?.results?.length === 1
      ? ""
      : "s"}`);
    return resp?.results;
  },
};
