import height from "../../height.app.mjs";

export default {
  key: "height-search-tasks",
  name: "Search Tasks",
  description: "Searches for tasks within your workspace using a text query. [See the documentation](https://height.notion.site/Search-tasks-bb201e3db042442e9a1d0686a7b271a2)",
  version: "0.0.1",
  type: "action",
  props: {
    height,
    query: {
      type: "string",
      label: "Query",
      description: "Full text search on the task",
    },
  },
  async run({ $ }) {
    const { list } = await this.height.searchTasks({
      $,
      params: {
        query: this.query,
        filters: {
          status: {
            values: [
              "backLog",
              "inProgress",
              "done",
            ],
          },
        },
      },
    });
    $.export("$summary", `Found ${list.length} task${list.length === 1
      ? ""
      : "s"} matching the query "${this.query}"`);
    return list;
  },
};
