import common from "../common/task-props.mjs";
import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "clickup-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes a checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists / Delete Checklist** section.",
  version: "0.0.8",
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
      taskId: propsFragments.taskId,
      checklistId: propsFragments.checklistId,
    },
  }),
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
