import app from "../../trackingtime.app.mjs";

export default {
  name: "Start Tracking Time",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    date: {
      label: "Date",
      description: "The event's start date. Format ISO 8601: `yyyy-MM-dd HH:mm:ss` like `2014-01-31 17:30:59`",
      type: "string",
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
    tags: {
      label: "Tags",
      description: "An array of tags to be added to the newly created time entry. E.g. `[{\"n\":\"name\",\"c\":\"color\",\"v\":\"value\",\"t\":\"type\"}]`",
      type: "boolean",
      optional: true,
    },
    timezone: {
      label: "Timezone",
      description: "The user's timezone as `GMT+3` or `GMT+03:00`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const tags = typeof this.tags === "string"
      ? JSON.parse(this.tags)
      : this.tags;

    const response = await this.app.startTrackingTime({
      $,
      taskId: this.taskId,
      params: {
        date: this.date,
        projectId: this.projectId,
        return_task: this.returnTask,
        stop_running_task: this.stopRunningTask,
        estimated_time: this.estimatedTime,
        timezone: this.timezone,
        tags,
      },
    });

    if (response) {
      $.export("$summary", `Successfully started tracking time of the task ID ${this.taskId}`);
    }

    return response;
  },
};
