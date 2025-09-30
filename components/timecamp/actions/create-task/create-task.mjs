import timecamp from "../../timecamp.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "timecamp-create-task",
  description: "Creates a task. [See docs here](https://developer.timecamp.com/docs/timecamp-api/b3A6NTg5ODUxMA-create-new-task)",
  type: "action",
  props: {
    timecamp,
    name: {
      label: "Name",
      description: "The name of the task",
      type: "string",
    },
    note: {
      label: "Description",
      description: "The description of the task",
      type: "string",
      optional: true,
    },
    tags: {
      label: "Tags",
      description: "The tags of the task. E.g. `IT, R&D`",
      type: "string",
      optional: true,
    },
    billable: {
      label: "Billable",
      description: "The task is billable",
      type: "boolean",
      optional: true,
    },
    budgetUnit: {
      label: "Budget Unit",
      description: "The budget unit of the task",
      type: "string",
      options: constants.BUDGET_UNITS,
      optional: true,
    },
    parentId: {
      label: "Parent Task ID",
      propDefinition: [
        timecamp,
        "taskId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.timecamp.createTask({
      $,
      data: {
        name: this.name,
        note: this.note,
        tags: this.tags,
        billable: this.billable,
        budget_unit: this.budgetUnit,
        parent_id: this.parentId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created task with id ${Object.values(response)[0].task_id}`);
    }

    return response;
  },
};
