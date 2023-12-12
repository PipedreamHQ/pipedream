import common from "../common/checklist-props.mjs";

export default {
  key: "clickup-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes a checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists / Delete Checklist** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { checklistId } = this;

    const response = await this.clickup.deleteChecklist({
      $,
      checklistId,
    });

    $.export("$summary", "Successfully deleted checklist");

    return response;
  },
};
