import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-update-checklist",
  name: "Update Checklist",
  description: "Updates a checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists / Edit Checklist** section.",
  version: "0.0.9",
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
    },
  }),
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
