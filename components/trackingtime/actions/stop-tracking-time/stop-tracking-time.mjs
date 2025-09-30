import app from "../../trackingtime.app.mjs";

export default {
  name: "Stop Tracking Time",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "trackingtime-stop-tracking-time",
  description: "Stop tracking time of a task. [See the documentation](https://api.trackingtime.co/doc/time_tracking.html#sync:~:text=Sync%20tracking%20event-,Start%20Tracking%20Time,-Starts%20a%20timer)",
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.stopTrackingTime({
      $,
      taskId: this.taskId,
    });

    if (response) {
      $.export("$summary", `Successfully stopped tracking time of the task ID ${this.taskId}`);
    }

    return response;
  },
};
