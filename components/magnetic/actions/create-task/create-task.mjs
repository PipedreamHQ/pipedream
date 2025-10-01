import magnetic from "../../magnetic.app.mjs";

export default {
  key: "magnetic-create-task",
  name: "Create Task",
  description: "Create a new task. [See docs here](https://app.magnetichq.com/Magnetic/API.do#ta-taskobject)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Whether the time tracked on this task is billable or not",
      optional: true,
    },
    trackedTime: {
      type: "integer",
      label: "Time Estimate",
      description: "The estimated time for the task in minutes",
      optional: true,
    },
    timeMinutes: {
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
    const data = {
      task: this.name,
      description: this.description,
      billable: this.billable,
      timeMinutes: this.timeMinutes,
      effortMinutes: this.trackedTime,
      startDate: this.startDate,
      endDate: this.endDate,
      grouping: this.grouping
        ? {
          id: this.grouping,
        }
        : undefined,
      user: this.user
        ? {
          id: this.user,
        }
        : undefined,
    };

    const response = await this.magnetic.createOrUpdateTask({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created task with ID ${response.id}`);
    }

    return response;
  },
};
