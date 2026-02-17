import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-filter",
  name: "Update Filter",
  description: "Updates a filter. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Filters/Update-a-filter)",
  version: "0.0.5",
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
    name: {
      propDefinition: [
        todoist,
        "name",
      ],
      optional: true,
    },
    query: {
      propDefinition: [
        todoist,
        "query",
      ],
      optional: true,
    },
    color: {
      propDefinition: [
        todoist,
        "color",
      ],
    },
    order: {
      propDefinition: [
        todoist,
        "order",
      ],
    },
    favorite: {
      propDefinition: [
        todoist,
        "favorite",
      ],
    },
  },
  async run ({ $ }) {
    const {
      filter,
      name,
      query,
      color,
      order,
      favorite,
    } = this;
    const data = {
      id: filter,
      name,
      query,
      color,
      item_order: order,
      is_favorite: favorite,
    };
    const resp = await this.todoist.updateFilter({
      $,
      data,
    });
    $.export("$summary", "Successfully updated filter");
    return resp;
  },
};
