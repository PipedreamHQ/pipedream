import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-label",
  name: "Delete Label",
  description: "Deletes a label. [See the docs here](https://developer.todoist.com/rest/v2/#delete-a-personal-label)",
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
      optional: false,
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
