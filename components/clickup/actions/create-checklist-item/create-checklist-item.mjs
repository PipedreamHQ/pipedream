import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-create-checklist-item",
  name: "Create Checklist Item",
  description: "Creates a new item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists / Create Checklist Item** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      type: "string",
      description: "The name of item",
    },
    assignee: {
      label: "Assignee",
      type: "string",
      propDefinition: [
        common.props.clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
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
      taskId: propsFragments.taskId,
      checklistId: propsFragments.checklistId,
    },
  }),
  async run({ $ }) {
    const {
      taskId,
      checklistId,
      name,
      assignee,
    } = this;

    const response = await this.clickup.createChecklistItem({
      $,
      taskId,
      checklistId,
      data: {
        name,
        assignee,
      },
    });

    $.export("$summary", "Successfully created checklist item");

    return response;
  },
};
