import magnetic from "../../magnetic.app.mjs";

export default {
  key: "magnetic-log-time-on-task",
  name: "Log Time on Task",
  description: "Log time on an existing task. [See docs here](https://app.magnetichq.com/Magnetic/API.do#ta-taskobject)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    magnetic,
    task: {
      propDefinition: [
        magnetic,
        "task",
      ],
    },
    trackedTime: {
      type: "integer",
      label: "Tracked Time",
      description: "The time tracked in minutes to add to the task",
    },
  },
  async run({ $ }) {
    const task = await this.magnetic.getTask({
      params: {
        id: this.task,
      },
      $,
    });

    const data = {
      ...task,
      timeMinutes: this.trackedTime + task.timeMinutes,
    };

    const response = await this.magnetic.createOrUpdateTask({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated task with ID ${response.id}`);
    }

    return response;
  },
};
