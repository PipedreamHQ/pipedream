import common from "../common/task-props.mjs";

export default {
  key: "clickup-remove-task-custom-field",
  name: "Remove Task Custom Field",
  description: "Remove custom field from a task. See the docs [here](https://clickup.com/api) in **Custom Fields / Remove Custom Field Value** section.",
  version: "0.0.7",
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
  },
  async run({ $ }) {
    const {
      taskId,
      customFieldId,
    } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const response = await this.clickup.removeTaskCustomField({
      $,
      taskId,
      customFieldId,
      params,
    });

    $.export("$summary", "Successfully removed custom field of task");

    return response;
  },
};
