import common from "../common/checklist-props.mjs";

export default {
  key: "clickup-delete-checklist-item",
  name: "Delete Checklist Item",
  description: "Deletes item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists / Delete Checklist Item** section.",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    checklistItemId: {
      propDefinition: [
        common.props.clickup,
        "checklistItems",
        (c) => ({
          taskId: c.taskId,
          checklistId: c.checklistId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      checklistId,
      checklistItemId,
    } = this;

    const response = await this.clickup.deleteChecklistItem({
      $,
      checklistId,
      checklistItemId,
    });

    $.export("$summary", "Successfully deleted checklist item");

    return response;
  },
};
