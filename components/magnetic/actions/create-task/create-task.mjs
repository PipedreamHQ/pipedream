import magnetic from "../../magnetic.app.mjs";

export default {
  key: "magnetic-create-task",
  name: "Create Task",
  description: "Create a new task. [See docs here](https://app.magnetichq.com/Magnetic/API.do#ta-taskobject)",
  version: "0.0.1",
  type: "action",
  props: {
    magnetic,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new task",
      optional: true,
    },
    grouping: {
      propDefinition: [
        magnetic,
        "grouping",
      ],
    },
    user: {
      propDefinition: [
        magnetic,
        "user",
      ],
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Whether the time tracked on this task is billable or not",
      optional: true,
    },
    timeMinutes: {
      type: "integer",
      label: "Time Estimate",
      description: "The estimated time for the task in minutes",
      optional: true,
    },
    trackedTime: {
      type: "integer",
      label: "Tracked Time",
      description: "The time in minutes that the Task Owner has already tracked",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the new task in ISO 8601 format",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the new task in ISO 8601 format",
      optional: true,
    },
  },
  async run({ $ }) {
    const grouping = this.grouping
      ? await this.magnetic.getGrouping({
        params: {
          id: this.grouping,
        },
      })
      : undefined;
    const user = this.user
      ? await this.magnetic.getUser({
        params: {
          id: this.user,
        },
      })
      : undefined;

    const data = {
      task: this.name,
      description: this.description,
      billable: this.billable,
      timeMinutes: this.timeMinutes,
      effortMinutes: this.trackedTime,
      startDate: this.startDate,
      endDate: this.endDate,
      grouping,
      user,
    };

    const response = await this.magnetic.createTask({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created task with ID ${response.id}`);
    }

    return response;
  },
};
