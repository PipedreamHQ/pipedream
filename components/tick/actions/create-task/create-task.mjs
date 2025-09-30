import tick from "../../tick.app.mjs";

export default {
  name: "Create Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "tick-create-task",
  description: "Creates a task. [See docs here](https://github.com/tick/tick-api/blob/master/sections/tasks.md#create-task)",
  type: "action",
  props: {
    tick,
    name: {
      label: "Name",
      description: "The name of the task",
      type: "string",
    },
    projectId: {
      propDefinition: [
        tick,
        "projectId",
      ],
    },
    budget: {
      label: "Budget",
      description: "The budget of the task. E.g. `50.0`",
      type: "string",
    },
    billable: {
      label: "Billable",
      description: "The task is billable",
      type: "boolean",
    },
  },
  async run({ $ }) {
    const response = await this.tick.createTask({
      $,
      data: {
        name: this.name,
        project_id: this.projectId,
        budget: this.budget,
        billable: this.billable,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created task with id ${response.id}`);
    }

    return response;
  },
};
