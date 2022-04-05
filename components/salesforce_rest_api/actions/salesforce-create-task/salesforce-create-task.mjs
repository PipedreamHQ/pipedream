import salesforce from "../../salesforce_rest_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-task",
  name: "Create Task",
  description: "Creates a task, which represents a business activity such as making a phone call or other to-do items.",
  version: "0.3.2",
  type: "action",
  props: {
    salesforce,
    Priority: {
      type: "string",
      label: "Priority",
      description: "Required. Indicates the importance or urgency of a task, such as high or low.",
    },
    Status: {
      type: "string",
      label: "Status",
      description: "Required. The status of the task, such as In Progress or Completed. Each predefined Status field implies a value for the IsClosed flag. To obtain picklist values, query the TaskStatus object. Note This field can't be updated for recurring tasks (IsRecurrence is true).",
    },
    ActivityDate: {
      type: "string",
      label: "ActivityDate",
      description: "Represents the due date of the task. This field has a timestamp that is always set to midnight in the Coordinated Universal Time (UTC) time zone. The timestamp is not relevant; do not attempt to alter it to accommodate time zone differences. Note This field can't be set or updated for a recurring task (IsRecurrence is true).",
      optional: true,
    },
    CallDisposition: {
      type: "string",
      label: "CallDisposition",
      description: "Represents the result of a given call, for example, we'll call back, or call unsuccessful. Limit is 255 characters. Not subject to field-level security, available for any user in an organization with Salesforce CRM Call Center.",
      optional: true,
    },
    CallDurationInSeconds: {
      type: "integer",
      label: "CallDurationInSeconds",
      description: "Duration of the call in seconds. Not subject to field-level security, available for any user in an organization with Salesforce CRM Call Center.",
      optional: true,
    },
    CallObject: {
      type: "string",
      label: "CallObject",
      description: "Name of a call center. Limit is 255 characters. Not subject to field-level security, available for any user in an organization with Salesforce CRM Call Center.",
      optional: true,
    },
    CallType: {
      type: "string",
      label: "CallType",
      description: "The type of call being answered: Inbound, Internal, or Outbound.",
      optional: true,
      options: [
        "Inbound",
        "Internal",
        "Outbound",
      ],
    },
    Description: {
      type: "string",
      label: "Description",
      description: "Contains a text description of the task.",
      optional: true,
    },
    IsRecurrence: {
      type: "boolean",
      label: "IsRecurrence",
      description: "Indicates whether the task is scheduled to repeat itself (true) or only occurs once (false). This field is read-only on update, but not on create. If this field value is true, then RecurrenceStartDateOnly, RecurrenceEndDateOnly, RecurrenceType, and any recurrence fields associated with the given recurrence type must be populated. See [Recurring Tasks](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_task.htm#RecurTasks).",
      optional: true,
    },
    IsReminderSet: {
      type: "boolean",
      label: "IsReminderSet",
      description: "Indicates whether a popup reminder has been set for the task (true) or not (false).",
      optional: true,
    },
    OwnerId: {
      type: "string",
      label: "OwnerId",
      description: "ID of the User or Group who owns the record. This field accepts Groups of type Queue only. In the user interface, Group IDs correspond with the queue's list view names. To create or update tasks assigned to Group, use v48.0 or later.",
      optional: true,
    },
    RecurrenceDayOfMonth: {
      type: "integer",
      label: "RecurrenceDayOfMonth",
      description: "The day of the month in which the task repeats.",
      optional: true,
    },
    RecurrenceDayOfWeekMask: {
      type: "integer",
      label: "RecurrenceDayOfWeekMask",
      description: "The day or days of the week on which the task repeats. This field contains a bitmask. The values are as follows: Sunday = 1 Monday = 2 Tuesday = 4 Wednesday = 8 Thursday = 16 Friday = 32 Saturday = 64 Multiple days are represented as the sum of their numerical values. For example, Tuesday and Thursday = 4 + 16 = 20.",
      optional: true,
    },
    RecurrenceEndDateOnly: {
      type: "string",
      label: "RecurrenceEndDateOnly",
      description: "The last date on which the task repeats. This field has a timestamp that is always set to midnight in the Coordinated Universal Time (UTC) time zone. The timestamp is not relevant; do not attempt to alter it to accommodate time zone differences.",
      optional: true,
    },
    RecurrenceInstance: {
      type: "string",
      label: "RecurrenceInstance",
      description: "The frequency of the recurring task. For example, 2nd or 3rd.",
      optional: true,
    },
    RecurrenceInterval: {
      type: "integer",
      label: "RecurrenceInterval",
      description: "The interval between recurring tasks.",
      optional: true,
    },
    RecurrenceMonthOfYear: {
      type: "string",
      label: "RecurrenceMonthOfYear",
      description: "The month of the year in which the task repeats.",
      optional: true,
    },
    RecurrenceRegeneratedType: {
      type: "string",
      label: "RecurrenceRegeneratedType",
      description: "Represents what triggers a repeating task to repeat. Add this field to a page layout together with the RecurrenceInterval field, which determines the number of days between the triggering date (due date or close date) and the due date of the next repeating task in the series.",
      optional: true,
      options: [
        "None",
        "After due date",
        "After the task is closed",
        "(Task closed)",
      ],
    },
    RecurrenceStartDateOnly: {
      type: "string",
      label: "RecurrenceStartDateOnly",
      description: "The date when the recurring task begins. Must be a date and time before RecurrenceEndDateOnly.",
      optional: true,
    },
    RecurrenceTimeZoneSidKey: {
      type: "string",
      label: "RecurrenceTimeZoneSidKey",
      description: "The time zone associated with the recurring task. For example, UTC-8:00 for Pacific Standard Time.",
      optional: true,
    },
    RecurrenceType: {
      type: "string",
      label: "RecurrenceType",
      description: "Indicates how often the task repeats. For example, daily, weekly, or every nth month (where nth is defined in RecurrenceInstance).",
      optional: true,
    },
    ReminderDateTime: {
      type: "string",
      label: "ReminderDateTime",
      description: "Represents the time when the reminder is scheduled to fire, if IsReminderSet is set to true. If IsReminderSet is set to false, then the user may have deselected the reminder checkbox in the Salesforce user interface, or the reminder has already fired at the time indicated by the value.",
      optional: true,
    },
    Subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the task, such as Call or Send Quote. Limit: 255 characters.",
      optional: true,
    },
    TaskSubtype: {
      type: "string",
      label: "TaskSubtype",
      description: "Provides standard subtypes to facilitate creating and searching for specific task subtypes. This field isn't updateable. TaskSubtype values: Task Email List Email Cadence Call Note The Cadence subtype is an internal value used by High Velocity Sales, and can't be set manually.",
      optional: true,
      options: [
        "Task",
        "Email",
        "List Email",
        "Cadence",
        "Call",
      ],
    },
    TaskWhoIds: {
      type: "any",
      label: "TaskWhoIds",
      description: "A string array of contact or lead IDs related to this task. This JunctionIdList field is linked to the TaskWhoRelations child relationship. TaskWhoIds is only available when the shared activities setting is enabled. The first contact or lead ID in the list becomes the primary WhoId if you don't specify a primary WhoId. If you set the EventWhoIds field to null, all entries in the list are deleted and the value of WhoId is added as the first entry. Warning Adding a JunctionIdList field name to the fieldsToNull property deletes all related junction records. This action can't be undone.",
      optional: true,
    },
    Type: {
      type: "string",
      label: "Type",
      description: "The type of task, such as Call or Meeting.",
      optional: true,
    },
    WhatId: {
      type: "string",
      label: "WhatId",
      description: "The WhatId represents nonhuman objects such as accounts, opportunities, campaigns, cases, or custom objects. WhatIds are polymorphic. Polymorphic means a WhatId is equivalent to the ID of a related object.",
      optional: true,
    },
    WhoId: {
      type: "string",
      label: "WhoId",
      description: "The WhoId represents a human such as a lead or a contact. WhoIds are polymorphic. Polymorphic means a WhoId is equivalent to a contact's ID or a lead's ID. If Shared Activities is enabled, the value of this field is the ID of the related lead or primary contact. If you add, update, or remove the WhoId field, you might encounter problems with triggers, workflows, and data validation rules that are associated with the record. The label is Name ID. Beginning in API version 37.0, if the contact or lead ID in the WhoId field is not in the TaskWhoIds list, no error occurs and the ID is added to the TaskWhoIds as the primary WhoId. If WhoId is set to null, an arbitrary ID from the existing TaskWhoIds list is promoted to the primary position.",
      optional: true,
    },
  },
  async run({ $ }) {
    // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
    // Task object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_task.htm

    if (!this.Priority || !this.Status) {
      throw new Error("Must provide Priority and Status parameters.");
    }

    return await axios($, {
      "method": "post",
      "url": `${this.salesforce.$auth.instance_url}/services/data/v20.0/sobjects/Task/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce.$auth.oauth_access_token}`,
      },
      "data": {
        ActivityDate: this.ActivityDate,
        CallDisposition: this.CallDisposition,
        CallDurationInSeconds: this.CallDurationInSeconds,
        CallObject: this.CallObject,
        CallType: this.CallType,
        Description: this.Description,
        IsRecurrence: this.IsRecurrence,
        IsReminderSet: this.IsReminderSet,
        OwnerId: this.OwnerId,
        Priority: this.Priority,
        RecurrenceDayOfMonth: this.RecurrenceDayOfMonth,
        RecurrenceDayOfWeekMask: this.RecurrenceDayOfWeekMask,
        RecurrenceEndDateOnly: this.RecurrenceEndDateOnly,
        RecurrenceInstance: this.RecurrenceInstance,
        RecurrenceInterval: this.RecurrenceInterval,
        RecurrenceMonthOfYear: this.RecurrenceMonthOfYear,
        RecurrenceRegeneratedType: this.RecurrenceRegeneratedType,
        RecurrenceStartDateOnly: this.RecurrenceStartDateOnly,
        RecurrenceTimeZoneSidKey: this.RecurrenceTimeZoneSidKey,
        RecurrenceType: this.RecurrenceType,
        ReminderDateTime: this.ReminderDateTime,
        Status: this.Status,
        Subject: this.Subject,
        TaskSubtype: this.TaskSubtype,
        TaskWhoIds: this.TaskWhoIds,
        Type: this.Type,
        WhatId: this.WhatId,
        WhoId: this.WhoId,
      },
    });
  },
};
