import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-filter",
  name: "Create Filter",
  description: "Creates a filter. [See the docs here](https://developer.todoist.com/sync/v9/#add-a-filter)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    name: {
      propDefinition: [
        todoist,
        "name",
      ],
    },
    query: {
      propDefinition: [
        todoist,
        "query",
      ],
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
      name,
      query,
      color,
      order,
      favorite,
    } = this;
    const data = {
      name,
      query,
      color,
      item_order: order,
      is_favorite: favorite
        ? 1
        : 0,
    };
    const resp = await this.todoist.createFilter({
      $,
      data,
    });
    $.export("$summary", "Successfully created filter");
    return resp;
  },
};
