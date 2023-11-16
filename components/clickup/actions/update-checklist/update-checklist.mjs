import common from "../common/checklist-props.mjs";

export default {
  key: "clickup-update-checklist",
  name: "Update Checklist",
  description: "Updates a checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists / Edit Checklist** section.",
  version: "0.0.7",
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      type: "string",
      description: "The name of checklist",
    },
    position: {
      label: "Position",
      type: "integer",
      description: "The position of checklist",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      checklistId,
      name,
      position,
    } = this;

    const response = await this.clickup.updateChecklist({
      $,
      checklistId,
      data: {
        name,
        position,
      },
    });

    $.export("$summary", "Successfully updated checklist");

    return response;
  },
};
