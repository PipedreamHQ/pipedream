import desktime from "../../desktime.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "desktime-start-project",
  name: "Start Tracking Time for a Project",
  description: "Starts tracking time for a given project and optionally a task. [See the documentation](https://desktime.com/app/settings/api?tab=project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    desktime,
    projectId: {
      propDefinition: [
        desktime,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        desktime,
        "taskId",
        (c) => ({
          optional: true,
        }), // Making taskId optional
      ],
    },
  },
  async run({ $ }) {
    const response = await this.desktime.startTracking({
      projectId: this.projectId,
      taskId: this.taskId || undefined,
    });

    const summary = `Started tracking time for project ID: ${this.projectId}` + (this.taskId
      ? ` and task ID: ${this.taskId}`
      : "");
    $.export("$summary", summary);
    return response;
  },
};
