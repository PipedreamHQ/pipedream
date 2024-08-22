import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-update-checklist-item",
  name: "Update Checklist Item",
  description: "Updates item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists / Edit Checklist Item** section.",
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
    resolved: {
      label: "Resolved",
      description: "Set the item as resolved",
      type: "boolean",
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
      checklistItemId: propsFragments.checklistItemId,
      parent: {
        ...propsFragments.checklistItemId,
        label: "Checklist Parent",
        description: "Set another checklist item as parent",
        optional: true,
      },
    },
  }),
  async run({ $ }) {
    const {
      checklistId,
      checklistItemId,
      name,
      assignee,
      resolved,
      parent,
    } = this;

    const response = await this.clickup.updateChecklistItem({
      $,
      checklistId,
      checklistItemId,
      data: {
        name,
        assignee,
        resolved,
        parent,
      },
    });

    $.export("$summary", "Successfully updated checklist item");

    return response;
  },
};
