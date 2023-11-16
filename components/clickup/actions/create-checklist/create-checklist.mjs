import common from "../common/task-props.mjs";

export default {
  key: "clickup-create-checklist",
  name: "Create Checklist",
  description: "Creates a new checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists / Create Checklist** section.",
  version: "0.0.7",
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      type: "string",
      description: "The name of checklist",
    },
  },
  async run({ $ }) {
    const {
      taskId,
      name,
    } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const response = await this.clickup.createChecklist({
      $,
      taskId,
      data: {
        name,
      },
      params,
    });

    $.export("$summary", "Successfully created checklist");

    return response;
  },
};
