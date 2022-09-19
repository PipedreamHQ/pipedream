import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-label",
  name: "Create Label",
  description: "Creates a label. [See the docs here](https://developer.todoist.com/rest/v1/#create-a-new-label)",
  version: "0.0.1",
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
      favorite,
    };
    const resp = await this.todoist.createLabel({
      $,
      data,
    });
    $.export("$summary", "Successfully created label");
    return resp;
  },
};
