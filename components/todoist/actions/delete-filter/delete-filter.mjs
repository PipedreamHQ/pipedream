import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-filter",
  name: "Delete Filter",
  description: "Deletes a filter. [See the docs here](https://developer.todoist.com/sync/v9/#delete-a-filter)",
  version: "0.0.3",
  type: "action",
  props: {
    todoist,
    filter: {
      propDefinition: [
        todoist,
        "filter",
      ],
    },
  },
  async run ({ $ }) {
    const { filter } = this;
    const data = {
      id: filter,
    };
    const resp = await this.todoist.deleteFilter({
      $,
      data,
    });
    $.export("$summary", "Successfully deleted filter");
    return resp;
  },
};
