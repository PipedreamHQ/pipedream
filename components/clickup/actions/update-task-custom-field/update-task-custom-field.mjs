import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-update-task-custom-field",
  name: "Update Task Custom Field",
  description: "Update custom field value of a task. See the docs [here](https://clickup.com/api) in **Custom Fields / Set Custom Field Value** section.",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        clickup,
        "lists",
        (c) => ({
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
    },
    taskId: {
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    customFieldId: {
      propDefinition: [
        clickup,
        "customFields",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    value: {
      label: "Value",
      type: "any",
      description: "The value of custom field",
    },
  },
  async run({ $ }) {
    const {
      taskId,
      customFieldId,
      value,
    } = this;

    const response = await this.clickup.updateTaskCustomField({
      $,
      taskId,
      customFieldId,
      data: {
        value,
      },
    });

    $.export("$summary", "Successfully updated custom field of task");

    return response;
  },
};
