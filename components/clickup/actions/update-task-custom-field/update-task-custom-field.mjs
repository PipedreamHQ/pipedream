import common from "../common/task-props.mjs";

export default {
  key: "clickup-update-task-custom-field",
  name: "Update Task Custom Field",
  description: "Update custom field value of a task. See the docs [here](https://clickup.com/api) in **Custom Fields / Set Custom Field Value** section.",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    customFieldId: {
      propDefinition: [
        common.props.clickup,
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
