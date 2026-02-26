import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-label",
  name: "Delete Label",
  description: "Deletes a label. [See the documentation](https://developer.todoist.com/api/v1#tag/Labels/operation/delete_label_api_v1_labels__label_id__delete)",
  version: "0.0.7",
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
