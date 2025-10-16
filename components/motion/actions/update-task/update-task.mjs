import motion from "../../motion.app.mjs";

export default {
  key: "motion-update-task",
  name: "Update Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a specific task. [See the documentation](https://docs.usemotion.com/docs/motion-rest-api/a2b2ce881ce26-update-a-task)",
  type: "action",
  props: {
    motion,
    taskId: {
      propDefinition: [
        motion,
        "taskId",
      ],
    },
    name: {
      propDefinition: [
        motion,
        "name",
      ],
      optional: true,
    },
    dueDate: {
      propDefinition: [
        motion,
        "dueDate",
      ],
      optional: true,
    },
    duration: {
      propDefinition: [
        motion,
        "duration",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        motion,
        "projectId",
        ({ taskId }) => ({
          taskId,
        }),
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        motion,
        "description",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        motion,
        "priority",
      ],
      optional: true,
    },
    assigneeId: {
      propDefinition: [
        motion,
        "assigneeId",
        ({ taskId }) => ({
          taskId,
        }),
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        motion,
        "labelId",
        ({ taskId }) => ({
          taskId,
        }),
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        motion,
        "status",
        ({ taskId }) => ({
          taskId,
        }),
      ],
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.status === "Auto-Scheduled") {
      props.startDate = {
        type: "string",
        label: "Auto Scheduled Start Date",
        description: "ISO 8601 Date which is trimmed to the start of the day passed. Default: `2023-06-28T06:00:00.000Z` Example: `2023-06-28`.",
        optional: true,
      };
      props.deadlineType = {
        type: "string",
        label: "Auto Scheduled Deadline Type",
        description: "The type of the deadline.",
        options: [
          "HARD",
          "SOFT",
          "NONE",
        ],
        optional: true,
      };
      props.schedule = {
        type: "string",
        label: "Schedule",
        description: "Schedule the task must adhere to. Schedule MUST be 'Work Hours' if scheduling the task for another user.",
        default: "Work Hours",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      motion,
      taskId,
      status,
      startDate,
      deadlineType,
      duration,
      schedule,
      ...data
    } = this;

    if (status === "Auto-Scheduled") {
      data.autoScheduled = {};
      if (startDate) data.autoScheduled.startDate = startDate;
      if (deadlineType) data.autoScheduled.deadlineType = deadlineType;
      if (schedule) data.autoScheduled.schedule = schedule;
    }

    const response = await motion.updateTask({
      $,
      taskId,
      data: {
        ...data,
        duration: parseInt(duration) || duration,
        status,
      },
    });

    $.export("$summary", `The task with Id: ${taskId} was successfully updated!`);
    return response;
  },
};
