import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-label",
  name: "Delete Label",
  description: "Deletes a label. [See the docs here](https://developer.todoist.com/rest/v1/#delete-a-label)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    label: {
      propDefinition: [
        todoist,
        "label",
      ],
    },
  },
  async run ({ $ }) {
    const { label } = this;
    const data = {
      labelId: label,
    };
    // No interesting data is returned from Todoist
    await this.todoist.deleteLabel({
      $,
      data,
    });
    $.export("$summary", "Successfully deleted label");
    return {
      id: label,
      success: true,
    };
  },
};
