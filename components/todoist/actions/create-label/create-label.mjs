import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-label",
  name: "Create Label",
  description: "Creates a label. [See the documentation](https://developer.todoist.com/api/v1#tag/Labels/operation/create_label_api_v1_labels_post)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
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
    order: {
      propDefinition: [
        todoist,
        "order",
      ],
    },
    color: {
      propDefinition: [
        todoist,
        "color",
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
      order,
      color,
      favorite,
    } = this;
    const data = {
      name,
      order,
      color,
      is_favorite: favorite,
    };
    const resp = await this.todoist.createLabel({
      $,
      data,
    });
    $.export("$summary", "Successfully created label");
    return resp;
  },
};
