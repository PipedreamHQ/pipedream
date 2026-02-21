import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-filter",
  name: "Delete Filter",
  description: "Deletes a filter. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Filters/Delete-a-filter)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
