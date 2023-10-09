import app from "../../trackingtime.app.mjs";

export default {
  name: "Start Tracking Time",
  version: "0.0.5",
  key: "trackingtime-start-tracking-time",
  description: "Start tracking time of a task. [See the documentation](https://api.trackingtime.co/doc/time_tracking.html#sync:~:text=Sync%20tracking%20event-,Start%20Tracking%20Time,-Starts%20a%20timer)",
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
      optional: true,
    },
    estimatedTime: {
      label: "Estimated Time",
      description: "Set a new estimated time for this task",
      type: "string",
      optional: true,
    },
    stopRunningTask: {
      label: "Stop Running Task",
      description: "If set to true, any currently running task will be stopped before the new one is started.",
      type: "boolean",
      optional: true,
    },
    returnTask: {
      label: "Return Task",
      description: "If set to true, a task object is returned",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.startTrackingTime({
      $,
      taskId: this.taskId,
      data: {
        projectId: this.projectId,
        return_task: this.returnTask,
        stop_running_task: this.stopRunningTask,
        estimated_time: this.estimatedTime,
      },
    });

    if (response) {
      $.export("$summary", `Successfully started tracking time of the task ID ${this.taskId}`);
    }

    return response;
  },
};
