import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-label",
  name: "Update Label",
  description: "Updates a label. [See the docs here](https://developer.todoist.com/rest/v2/#update-a-personal-label)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    label: {
      propDefinition: [
        todoist,
        "label",
      ],
      description: "The label to update",
    },
    name: {
      propDefinition: [
        todoist,
        "name",
      ],
      optional: true,
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
      label,
      name,
      order,
      color,
      favorite,
    } = this;
    const data = {
      labelId: label,
      name,
      order,
      color,
      favorite,
    };
    // No interesting data is returned from Todoist
    await this.todoist.updateLabel({
      $,
      data,
    });
    $.export("$summary", "Successfully updated label");
    return {
      id: label,
      success: true,
    };
  },
};
