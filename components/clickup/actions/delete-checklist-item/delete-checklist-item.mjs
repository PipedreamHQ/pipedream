import common from "../common/checklist-item-props.mjs";

export default {
  key: "clickup-delete-checklist-item",
  name: "Delete Checklist Item",
  description: "Deletes item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists / Delete Checklist Item** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
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
