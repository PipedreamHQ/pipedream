import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-projects",
  name: "List Projects",
  description: "Returns a list of all projects. [See the docs here](https://developer.todoist.com/rest/v1/#get-all-projects)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
  },
  async run ({ $ }) {
    const resp = await this.todoist.getProjects({
      $,
    });
    $.export("$summary", "Successfully retrieved projects");
    $.export("$summary", `Successfully retrieved ${resp.length} project${resp.length === 1
      ? ""
      : "s"}`);
    return resp;
  },
};
