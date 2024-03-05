import desktime from "../../desktime.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "desktime-stop-project",
  name: "Stop Project",
  description: "Stop tracking time for a given project and optionally a task. [See the documentation](https://desktime.com/app/settings/api?tab=project)",
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
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.desktime.stopTracking({
      projectId: this.projectId,
      taskId: this.taskId || null,
    });

    const summaryMessage = `Stopped tracking time for project ID ${this.projectId}` +
      (this.taskId
        ? ` and task ID ${this.taskId}`
        : "");

    $.export("$summary", summaryMessage);
    return response;
  },
};
