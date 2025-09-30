import magnetic from "../../magnetic.app.mjs";

export default {
  key: "magnetic-find-task",
  name: "Find Task",
  description: "Search for a task by name or description [See docs here](https://app.magnetichq.com/Magnetic/API.do#ta-taskobject)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    magnetic,
    searchField: {
      type: "string",
      label: "Search Field",
      description: "Search by either name or description",
      options: [
        "name",
        "description",
      ],
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "Text to search for",
    },
  },
  async run({ $ }) {
    const response = await this.magnetic.listTasks({
      params: {
        searchField: this.searchField === "name"
          ? "task"
          : this.searchField,
        searchValue: this.searchValue,
      },
      $,
    });
    if (response) {
      $.export("$summary", `Found ${response.length} task${response.length === 1
        ? ""
        : "s"}`);
    }
    return response;
  },
};
