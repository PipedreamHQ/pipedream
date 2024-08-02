import {
  RECURRENCE_INSTANCE_OPTIONS,
  RECURRENCE_MONTH_OPTIONS,
  TIMEZONE_OPTIONS,
  RECURRENCE_TYPE_OPTIONS,
  WEEKDAY_MASK_OPTIONS,
} from "../constants-props.mjs";
import commonProps from "../props-async-options.mjs";

export default {
  createProps: {
    IsRecurrence: {
      type: "boolean",
      label: "Recurring",
      description:
        "Indicates whether the task is scheduled to repeat itself (`true`) or only occurs once (`false`).",
      optional: true,
    },
    TaskSubtype: {
      type: "string",
      label: "Task Subtype",
      description: "The subtype of the task.",
      optional: true,
      options: [
        {
          label: "Task",
          value: "Task",
        },
        {
          label: "Email",
          value: "Email",
        },
        {
          label: "List Email",
          value: "ListEmail",
        },
        {
          label: "Cadence",
          value: "Cadence",
        },
        {
          label: "Call",
          value: "Call",
        },
        {
          label: "LinkedIn",
          value: "LinkedIn",
        },
      ],
    },
  },
  initialProps: {
    ActivityDate: {
      type: "string",
      label: "Due Date",
      description: "Represents the due date of the task.",
      optional: true,
    },
    Description: {
      type: "string",
      label: "Description",
      description: "A text description of the task.",
      optional: true,
    },
    Priority: {
      type: "string",
      label: "Priority",
      description:
        "Indicates the importance or urgency of a task, such as high or low.",
      options: [
        "High",
        "Normal",
        "Low",
      ],
    },
  },
  extraProps: {
    OwnerId: {
      ...commonProps.UserId,
      label: "Owner ID",
      description: "ID of the User or Group who owns the record.",
      optional: true,
    },
    TaskWhoIds: {
      ...commonProps.ContactOrLeadIds,
      label: "Related IDs",
      description: "One or more Contact or Lead IDs related to this task.",
      optional: true,
    },
    CallDisposition: {
      type: "string",
      label: "Call Result",
      description:
        "Represents the result of a given call, for example, “we'll call back,” or “call unsuccessful.” Limit is 255 characters.",
      optional: true,
    },
    CallDurationInSeconds: {
      type: "integer",
      label: "Call Duration",
      description: "Duration of the call in seconds.",
      optional: true,
    },
    CallObject: {
      type: "string",
      label: "Call Object Identifier",
      description: "Name of a call center. Limit is 255 characters.",
      optional: true,
    },
    CallType: {
      type: "string",
      label: "Call Type",
      description: "The type of call being answered.",
      optional: true,
      options: [
        "Internal",
        "Inbound",
        "Outbound",
      ],
    },
    IsReminderSet: {
      type: "boolean",
      label: "Reminder Set",
      description:
        "Indicates whether a popup reminder has been set for the task.",
      optional: true,
    },
    IsVisibleInSelfService: {
      type: "boolean",
      label: "Visible in Self-Service",
      description:
        "Indicates whether a task associated with an object can be viewed in the Customer Portal.",
      optional: true,
    },
    RecurrenceDayOfMonth: {
      type: "integer",
      label: "Recurrence Day of Month",
      description: "The day of the month in which the task repeats.",
      optional: true,
    },
    RecurrenceDayOfWeekMask: {
      type: "integer[]",
      label: "Recurrence Day of Week Mask",
      description: "The day(s) of the week on which the task repeats.",
      optional: true,
      options: WEEKDAY_MASK_OPTIONS,
    },
    RecurrenceEndDateOnly: {
      type: "string",
      label: "Recurrence End Date",
      description: "The last date on which the task repeats.",
      optional: true,
    },
    RecurrenceInstance: {
      type: "string",
      label: "Recurrence Instance",
      description: "The frequency of the recurring task.",
      optional: true,
      options: RECURRENCE_INSTANCE_OPTIONS,
    },
    RecurrenceInterval: {
      type: "integer",
      label: "Recurrence Interval",
      description: "The interval between recurring tasks.",
      optional: true,
    },
    RecurrenceMonthOfYear: {
      type: "string",
      label: "Recurrence Month of Year",
      description: "The month of the year in which the task repeats.",
      optional: true,
      options: RECURRENCE_MONTH_OPTIONS,
    },
    RecurrenceRegeneratedType: {
      type: "string",
      label: "Repeat This Task",
      description: "Represents what triggers a repeating task to repeat.",
      optional: true,
      options: [
        {
          label: "After due date",
          value: "RecurrenceRegenerateAfterDueDate",
        },
        {
          label: "After date completed",
          value: "RecurrenceRegenerateAfterToday",
        },
        {
          label: "(Task Closed)",
          value: "RecurrenceRegenerated",
        },
      ],
    },
    RecurrenceStartDateOnly: {
      type: "string",
      label: "Recurrence Start Date",
      description: "The date when the recurring task begins.",
      optional: true,
    },
    RecurrenceTimeZoneSidKey: {
      type: "string",
      label: "Recurrence Time Zone",
      description: "The time zone associated with the recurring task.",
      optional: true,
      options: TIMEZONE_OPTIONS,
    },
    RecurrenceType: {
      type: "string",
      label: "Recurrence Type",
      description: "Indicates how often the task repeats.",
      optional: true,
      options: RECURRENCE_TYPE_OPTIONS,
    },
    ReminderDateTime: {
      type: "string",
      label: "Reminder Date / Time",
      description: "Represents the time when the reminder is scheduled to fire",
      optional: true,
    },
    Status: {
      type: "string",
      label: "Status",
      description: "The status of the task.",
      optional: true,
      options: [
        "Not Started",
        "In Progress",
        "Completed",
        "Waiting on someone else",
        "Deferred",
      ],
    },
    Subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the task. Limit: 255 characters.",
      optional: true,
      options: [
        "Call",
        "Email",
        "Send Letter",
        "Send Quote",
        "Other",
      ],
    },
  },
};
