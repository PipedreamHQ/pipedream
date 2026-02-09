import { cleanObject } from "../../common/utils.mjs";
import float from "../../float.app.mjs";

export default {
  key: "float-update-task",
  name: "Update Task",
  description: "Update an existing task (allocation). [See the documentation](https://developer.float.com/api_reference.html#!/Project_Tasks/updateProjectTask)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    float,
    taskId: {
      propDefinition: [
        float,
        "taskId",
      ],
    },
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
    const response = await this.float.updateTask({
      $,
      taskId: this.taskId,
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

    $.export("$summary", `Successfully updated task with ID: ${response.task_meta_id}`);
    return response;
  },
};
