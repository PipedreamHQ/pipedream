import { cleanObject } from "../../common/utils.mjs";
import float from "../../float.app.mjs";

export default {
  key: "float-create-task",
  name: "Create Task",
  description: "Create a new task (allocation). [See the documentation](https://developer.float.com/api_reference.html#!/Project_Tasks/addProjectTask)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    float,
    projectId: {
      propDefinition: [
        float,
        "projectId",
      ],
    },
    phaseId: {
      propDefinition: [
        float,
        "phaseId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    taskName: {
      propDefinition: [
        float,
        "taskName",
      ],
    },
    billable: {
      propDefinition: [
        float,
        "billable",
      ],
    },
    budget: {
      propDefinition: [
        float,
        "budget",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.float.createTask({
      $,
      data: cleanObject({
        project_id: this.projectId,
        phase_id: this.phaseId,
        task_name: this.taskName,
        billable: this.billable != null
          ? +this.billable
          : undefined,
        budget: this.budget && parseFloat(this.budget),
      }),
    });

    $.export("$summary", `Successfully created task with ID: ${response.task_meta_id}`);
    return response;
  },
};
