// legacy_hash_id: a_3LiebX
import { axios } from "@pipedream/platform";

export default {
  key: "pipedream-schedule-task-in-future",
  name: "Pipedream Task Scheduler - Schedule Task",
  description: "Schedule a task with an existing task scheduler source. See https://github.com/PipedreamHQ/pipedream/blob/master/components/pipedream/sources/new-scheduled-tasks/README.md",
  version: "0.2.1",
  type: "action",
  props: {
    numSeconds: {
      type: "string",
      label: "Num Seconds",
      description: "How many seconds in the future would you like to schedule the task?",
    },
    secret: {
      type: "string",
      optional: true,
    },
    taskSchedulerURL: {
      type: "string",
      label: "Task Scheduler URL",
      description: "Enter the URL as it appears in the **Endpoint** field of your Task Scheduler source",
    },
    message: {
      type: "string",
      description: "The message / payload to send to your task scheduler. Can be any string or JavaScript object. This message will be emitted by the task scheduler at the specified number of seconds in the future.",
    },
  },
  async run({ $ }) {
  // N seconds from now
    $.export("ts", (new Date(+new Date() + (this.numSeconds * 1000))).toISOString());

    const headers = {
      "Content-Type": "application/json",
    };
    if (this.secret) {
      headers["x-pd-secret"] = this.secret;
    }

    return await axios($, {
      url: `${this.taskSchedulerURL}/schedule`,
      headers,
      data: {
        timestamp: this.ts,
        message: this.message,
      },
    });
  },
};
