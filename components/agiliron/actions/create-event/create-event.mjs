import agiliron from "../../agiliron.app.mjs";
import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "agiliron-create-event",
  name: "Create Event",
  description: "Creates a new event within Agiliron. [See the documentation](https://api.agiliron.com/docs/add-event-2)",
  version: "0.0.1",
  type: "action",
  props: {
    agiliron,
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the event",
    },
    startdate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the event (format: MM-DD-YYYY)",
    },
    starttime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the event (format: HH:MM)",
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
      options: constants.RECURRING_EVENT_OPTIONS,
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
      propDefinition: [
        agiliron,
        "contactName",
      ],
      optional: true,
    },
    sendReminder: {
      type: "string",
      label: "Send Reminder",
      description: "Whether to send a reminder for the event",
      options: constants.BOOL_OPTIONS,
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
      description: "The status of the event",
      options: constants.STATUS_OPTIONS,
      optional: true,
    },
    sendNotification: {
      type: "string",
      label: "Send Notification",
      description: "Whether to send a notification for the event",
      options: constants.BOOL_OPTIONS,
      optional: true,
    },
    activityType: {
      type: "string",
      label: "Activity Type",
      description: "The type of activity for the event",
      options: constants.ACTIVITY_TYPE_OPTIONS,
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
    customFields: {
      propDefinition: [
        agiliron,
        "customFields",
      ],
      optional: true,
    },
    relatedToType: {
      type: "string",
      label: "Related To Type",
      description: "The type of the entity related to the event",
      options: constants.RELATED_TO_TYPE_OPTIONS,
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.relatedToType) {
      props.relatedToValue = {
        type: "string",
        label: "Related To Value",
        description: "The value of the entity related to the event",
        options: async ({ page }) => {
          return this.agiliron.prepareItems({
            type: this.relatedToType,
            page: page + 1,
          });
        },
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const parsedCustomFields = parseObject(this.customFields);
    const customFields = parsedCustomFields && Object.keys(parsedCustomFields).map((key) => ({
      Name: key,
      value: parsedCustomFields[key],
    }));

    const event = {
      Subject: this.subject,
      StartDate: this.startdate,
      StartTime: this.starttime,
      DurationInHours: this.durationInHours,
      DurationInMinutes: this.durationInMinutes,
      RecurringEvents: this.recurringEvents,
      RepeatUntil: this.repeatUntil
        ? this.repeatUntil
        : this.startdate,
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
      EventCustomFields: {
        CustomField: customFields,
      },
    };

    const response = await this.agiliron.addEvent({
      $,
      data: {
        Events: {
          Event: event,
        },
      },
    });
    $.export("$summary", `Successfully created event with Id: ${response?.MCM?.parameters?.results?.message?.success_message?.event_id}`);
    return response;
  },
};
