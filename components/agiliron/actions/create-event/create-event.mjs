import agiliron from "../../agiliron.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiliron-create-event",
  name: "Create Event",
  description: "Creates a new event within Agiliron. [See the documentation](https://api.agiliron.com/docs/add-event-2)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agiliron,
    subject: {
      propDefinition: [
        agiliron,
        "subject",
      ],
    },
    startdate: {
      propDefinition: [
        agiliron,
        "startdate",
      ],
    },
    starttime: {
      propDefinition: [
        agiliron,
        "starttime",
      ],
    },
    durationInHours: {
      type: "string",
      label: "Duration in Hours",
      description: "The duration of the event in hours",
      optional: true,
    },
    durationInMinutes: {
      type: "string",
      label: "Duration in Minutes",
      description: "The duration of the event in minutes",
      optional: true,
    },
    recurringEvents: {
      type: "string",
      label: "Recurring Events",
      description: "Details of the recurring events",
      optional: true,
    },
    repeatUntil: {
      type: "string",
      label: "Repeat Until",
      description: "The end date of the recurring events (format: MM-DD-YYYY)",
      optional: true,
    },
    accountName: {
      type: "string",
      label: "Account Name",
      description: "The name of the account related to the event",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact related to the event",
      optional: true,
    },
    relatedToType: {
      type: "string",
      label: "Related To Type",
      description: "The type of the entity related to the event (e.g., Accounts, Leads)",
      optional: true,
    },
    relatedToValue: {
      type: "string",
      label: "Related To Value",
      description: "The value of the entity related to the event",
      optional: true,
    },
    sendReminder: {
      type: "string",
      label: "Send Reminder",
      description: "Whether to send a reminder for the event (Yes/No)",
      optional: true,
    },
    reminderDays: {
      type: "string",
      label: "Reminder Days",
      description: "Number of days before the event to send a reminder",
      optional: true,
    },
    reminderHours: {
      type: "string",
      label: "Reminder Hours",
      description: "Number of hours before the event to send a reminder",
      optional: true,
    },
    reminderMinutes: {
      type: "string",
      label: "Reminder Minutes",
      description: "Number of minutes before the event to send a reminder",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the event (e.g., Planned, Completed)",
      optional: true,
    },
    sendNotification: {
      type: "string",
      label: "Send Notification",
      description: "Whether to send a notification for the event (Yes/No)",
      optional: true,
    },
    activityType: {
      type: "string",
      label: "Activity Type",
      description: "The type of activity for the event (e.g., Call, Meeting)",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the event",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the event",
      optional: true,
    },
    eventCustomFields: {
      type: "string[]",
      label: "Event Custom Fields",
      description: "An array of custom fields for the event, each item should be a JSON string with 'Name' and 'Value' keys",
      optional: true,
    },
  },
  async run({ $ }) {
    const eventCustomFields = this.eventCustomFields?.map(JSON.parse);

    const data = {
      Subject: this.subject,
      StartDate: this.startdate,
      StartTime: this.starttime,
      DurationInHours: this.durationInHours,
      DurationInMinutes: this.durationInMinutes,
      RecurringEvents: this.recurringEvents,
      RepeatUntil: this.repeatUntil,
      AccountName: this.accountName,
      ContactName: this.contactName,
      RelatedToType: this.relatedToType,
      RelatedToValue: this.relatedToValue,
      SendReminder: this.sendReminder,
      ReminderDays: this.reminderDays,
      ReminderHours: this.reminderHours,
      ReminderMinutes: this.reminderMinutes,
      Status: this.status,
      SendNotification: this.sendNotification,
      ActivityType: this.activityType,
      Location: this.location,
      Description: this.description,
      EventCustomFields: eventCustomFields
        ? {
          CustomField: eventCustomFields,
        }
        : undefined,
    };

    const response = await this.agiliron.addEvent(data);
    $.export("$summary", `Successfully created event with subject: ${this.subject}`);
    return response;
  },
};
