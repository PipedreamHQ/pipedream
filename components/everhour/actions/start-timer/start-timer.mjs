import everhour from "../../everhour.app.mjs";

export default {
  key: "everhour-start-timer",
  name: "Start Timer",
  description: "Begins a new timer for a task. [See the documentation](https://everhour.docs.apiary.io/#reference/0/timers/start-timer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    everhour,
    projectId: {
      propDefinition: [
        everhour,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        everhour,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    userDate: {
      type: "string",
      label: "User Date",
      description: "Date string to associate with the timer. Format as 'YYYY-MM-DD'",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "An optional comment to associate with the timer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.everhour.startTimer({
      $,
      data: {
        task: this.taskId,
        userDate: this.userDate,
        comment: this.comment,
      },
    });

    $.export("$summary", `Successfully started a timer for task ID: ${this.taskId}`);
    return response;
  },
};
