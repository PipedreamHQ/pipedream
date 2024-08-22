import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-delete-checklist-item",
  name: "Delete Checklist Item",
  description: "Deletes item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists / Delete Checklist Item** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
    listWithFolder: {
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps({
    tailProps: {
      taskId: {
        ...propsFragments.taskId,
        description: "To show options please select a **List** first",
      },
      checklistId: propsFragments.checklistId,
      checklistItemId: propsFragments.checklistItemId,
    },
  }),
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
