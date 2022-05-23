import constants from "../constants.mjs";

export default {
  ActivityDate: {
    type: "string",
    label: "Activity date",
    description: "Represents the due date of the task. This field has a timestamp that is always set to midnight in the Coordinated Universal Time (UTC) time zone. The timestamp is not relevant; do not attempt to alter it to accommodate time zone differences. Note This field can't be set or updated for a recurring task (IsRecurrence is true).",
  },
  CallDisposition: {
    type: "string",
    label: "Call disposition",
    description: "Represents the result of a given call, for example, we'll call back, or call unsuccessful. Limit is 255 characters. Not subject to field-level security, available for any user in an organization with Salesforce CRM Call Center.",
  },
  CallDurationInSeconds: {
    type: "integer",
    label: "Call duration in seconds",
    description: "Duration of the call in seconds. Not subject to field-level security, available for any user in an organization with Salesforce CRM Call Center.",
  },
  CallObject: {
    type: "string",
    label: "Call object",
    description: "Name of a call center. Limit is 255 characters. Not subject to field-level security, available for any user in an organization with Salesforce CRM Call Center.",
  },
  CallType: {
    type: "string",
    label: "Call type",
    description: "The type of call being answered: Inbound, Internal, or Outbound.",
    options: constants.CALL_TYPES,
  },
  Description: {
    type: "string",
    label: "Description",
    description: "Contains a text description of the task.",
  },
  IsRecurrence: {
    type: "boolean",
    label: "Is recurrence",
    description: "Indicates whether the task is scheduled to repeat itself (true) or only occurs once (false). This field is read-only on update, but not on create. If this field value is true, then RecurrenceStartDateOnly, RecurrenceEndDateOnly, RecurrenceType, and any recurrence fields associated with the given recurrence type must be populated. See [Recurring Tasks](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_task.htm#RecurTasks).",
  },
  IsReminderSet: {
    type: "boolean",
    label: "Is reminder set",
    description: "Indicates whether a popup reminder has been set for the task (true) or not (false).",
  },
  OwnerId: {
    type: "string",
    label: "Owner id",
    description: "ID of the User or Group who owns the record. This field accepts Groups of type Queue only. In the user interface, Group IDs correspond with the queue's list view names. To create or update tasks assigned to Group, use v48.0 or later.",
  },
  RecurrenceDayOfMonth: {
    type: "integer",
    label: "Recurrence day of month",
    description: "The day of the month in which the task repeats.",
  },
  RecurrenceDayOfWeekMask: {
    type: "integer",
    label: "Recurrence day of week mask",
    description: "The day or days of the week on which the task repeats. This field contains a bitmask. The values are as follows: Sunday = 1 Monday = 2 Tuesday = 4 Wednesday = 8 Thursday = 16 Friday = 32 Saturday = 64 Multiple days are represented as the sum of their numerical values. For example, Tuesday and Thursday = 4 + 16 = 20.",
  },
  RecurrenceEndDateOnly: {
    type: "string",
    label: "Recurrence end date only",
    description: "The last date on which the task repeats. This field has a timestamp that is always set to midnight in the Coordinated Universal Time (UTC) time zone. The timestamp is not relevant; do not attempt to alter it to accommodate time zone differences.",
  },
  RecurrenceInstance: {
    type: "string",
    label: "Recurrence instance",
    description: "The frequency of the recurring task. For example, 2nd or 3rd.",
  },
  RecurrenceInterval: {
    type: "integer",
    label: "Recurrence interval",
    description: "The interval between recurring tasks.",
  },
  RecurrenceMonthOfYear: {
    type: "string",
    label: "Recurrence month of year",
    description: "The month of the year in which the task repeats.",
  },
  RecurrenceRegeneratedType: {
    type: "string",
    label: "Recurrence regenerated type",
    description: "Represents what triggers a repeating task to repeat. Add this field to a page layout together with the RecurrenceInterval field, which determines the number of days between the triggering date (due date or close date) and the due date of the next repeating task in the series.",
    options: constants.RECURRENCE_REGENERATED_TYPE,
  },
  RecurrenceStartDateOnly: {
    type: "string",
    label: "Recurrence start date only",
    description: "The date when the recurring task begins. Must be a date and time before RecurrenceEndDateOnly.",
  },
  RecurrenceTimeZoneSidKey: {
    type: "string",
    label: "Recurrence timezone sid-key",
    description: "The time zone associated with the recurring task. For example, UTC-8:00 for Pacific Standard Time.",
  },
  RecurrenceType: {
    type: "string",
    label: "Recurrence type",
    description: "Indicates how often the task repeats. For example, daily, weekly, or every nth month (where nth is defined in RecurrenceInstance).",
  },
  ReminderDateTime: {
    type: "string",
    label: "Reminder date-time",
    description: "Represents the time when the reminder is scheduled to fire, if IsReminderSet is set to true. If IsReminderSet is set to false, then the user may have deselected the reminder checkbox in the Salesforce user interface, or the reminder has already fired at the time indicated by the value.",
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
  TaskWhoIds: {
    type: "any",
    label: "Task who IDs",
    description: "A string array of contact or lead IDs related to this task. This JunctionIdList field is linked to the TaskWhoRelations child relationship. TaskWhoIds is only available when the shared activities setting is enabled. The first contact or lead ID in the list becomes the primary WhoId if you don't specify a primary WhoId. If you set the EventWhoIds field to null, all entries in the list are deleted and the value of WhoId is added as the first entry. Warning Adding a JunctionIdList field name to the fieldsToNull property deletes all related junction records. This action can't be undone.",
  },
  Type: {
    type: "string",
    label: "Type",
    description: "The type of task, such as Call or Meeting.",
  },
  WhatId: {
    type: "string",
    label: "What ID",
    description: "The What ID represents nonhuman objects such as accounts, opportunities, campaigns, cases, or custom objects. WhatIds are polymorphic. Polymorphic means a WhatId is equivalent to the ID of a related object.",
  },
  WhoId: {
    type: "string",
    label: "Who ID",
    description: "The Who ID represents a human such as a lead or a contact. WhoIds are polymorphic. Polymorphic means a WhoId is equivalent to a contact's ID or a lead's ID. If Shared Activities is enabled, the value of this field is the ID of the related lead or primary contact. If you add, update, or remove the WhoId field, you might encounter problems with triggers, workflows, and data validation rules that are associated with the record. The label is Name ID. Beginning in API version 37.0, if the contact or lead ID in the WhoId field is not in the TaskWhoIds list, no error occurs and the ID is added to the TaskWhoIds as the primary WhoId. If WhoId is set to null, an arbitrary ID from the existing TaskWhoIds list is promoted to the primary position.",
  },
};
