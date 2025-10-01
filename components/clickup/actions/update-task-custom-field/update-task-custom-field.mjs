import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-update-task-custom-field",
  name: "Update Task Custom Field",
  description: "Update custom field value of a task. [See the documentation](https://clickup.com/api) in **Custom Fields / Set Custom Field Value** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    value: {
      label: "Value",
      type: "any",
      description: "The value of custom field",
    },
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
    },
    taskId: {
      propDefinition: [
        common.props.clickup,
        "taskId",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
      description: "To show options please select a **List** first",
    },
    customFieldId: {
      propDefinition: [
        common.props.clickup,
        "customFieldId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      taskId,
      customFieldId,
      value,
    } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const response = await this.clickup.updateTaskCustomField({
      $,
      taskId,
      customFieldId,
      data: {
        value,
      },
      params,
    });

    $.export("$summary", "Successfully updated custom field of task");

    return response;
  },
};
