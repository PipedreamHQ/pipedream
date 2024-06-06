import height from "../../height.app.mjs";

export default {
  key: "height-search-tasks",
  name: "Search Tasks",
  description: "Searches for tasks within your workspace using a text query",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    height,
    query: {
      propDefinition: [
        height,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.height.searchTasks(this.query);
    $.export("$summary", `Searched for tasks with the query "${this.query}"`);
    return response;
  },
};
