import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-update-task-custom-field",
  name: "Update Task Custom Field",
  description: "Update custom field value of a task. [See the documentation](https://clickup.com/api) in **Custom Fields / Set Custom Field Value** section.",
  version: "1.0.0",
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
      type: "string",
      description: "The value of the custom field. JSON text is sent as the parsed value, so use e.g. `42` for a number field, `true` for a checkbox, or `[\"uuid-1\",\"uuid-2\"]` for a labels field; anything else is sent as text.",
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
  methods: {
    parseValue(value) {
      if (typeof value !== "string") {
        return value;
      }
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
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
        value: this.parseValue(value),
      },
      params,
    });

    $.export("$summary", "Successfully updated custom field of task");

    return response;
  },
};
