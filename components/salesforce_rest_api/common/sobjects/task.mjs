import constants from "../constants.mjs";

export default {
  ActivityDate: {
    type: "string",
    label: "Activity date",
    description: "Represents the due date of the task. This field has a timestamp that is always set to midnight in the Coordinated Universal Time (UTC) time zone. The timestamp is not relevant; do not attempt to alter it to accommodate time zone differences. Note This field can't be set or updated for a recurring task (IsRecurrence is true).",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "Contains a text description of the task.",
  },
  Subject: {
    type: "string",
    label: "Subject",
    description: "The subject line of the task, such as Call or Send Quote. Limit: 255 characters.",
  },
  TaskSubtype: {
    type: "string",
    label: "Task sub-type",
    description: "Provides standard subtypes to facilitate creating and searching for specific task subtypes. This field isn't updateable. TaskSubtype values: Task Email List Email Cadence Call Note The Cadence subtype is an internal value used by High Velocity Sales, and can't be set manually.",
    options: constants.TASK_SUB_TYPES,
  },
};
