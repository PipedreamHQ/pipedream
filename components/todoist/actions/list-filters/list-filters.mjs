import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-filters",
  name: "List Filters",
  description: "Returns a list of all filters. [See the docs here](https://developer.todoist.com/sync/v9/#read-resources)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    db: "$.service.db",
  },
  async run ({ $ }) {
    const resp = await this.todoist.getFilters({
      $,
      db: this.db,
    });
    $.export("$summary", `Successfully retrieved ${resp.length} filter${resp.length === 1
      ? ""
      : "s"}`);
    return resp;
  },
};
