import { // eslint-disable-next-line max-len
  RECURRENCE_INSTANCE_OPTIONS, RECURRENCE_MONTH_OPTIONS, TIMEZONE_OPTIONS, RECURRENCE_TYPE_OPTIONS, WEEKDAY_MASK_OPTIONS,
} from "../constants-props.mjs";
import commonProps from "../props-async-options.mjs";

export default {
  initialProps: {
    AcceptedEventInviteeIds: {
      ...commonProps.ContactOrLeadIds,
      label: "Accepted Event Invitee IDs",
      description: "One or more Contact or Lead IDs who accepted this event.",
      optional: true,
      async options() {
        const contacts = await this.salesforce.listRecordOptions({
          objType: "Contact",
          nameField: "Name",
        });
        const leads = await this.salesforce.listRecordOptions({
          objType: "Lead",
          nameField: "Name",
        });
        return [
          ...(contacts ?? []),
          ...(leads ?? []),
        ];
      },
    },
    ActivityDate: {
      type: "string",
      label: "Due Date / Time",
      description:
        "The date/time (`ActivityDateTime`) of the event, or only the date (`ActivityDate`) if it is an all-day event.",
    },
    Description: {
      type: "string",
      label: "Description",
      description: "A text description of the event. Limit: 32,000 characters.",
      optional: true,
    },
    DurationInMinutes: {
      type: "integer",
      label: "Duration (in minutes)",
      description: "The event length in minutes.",
      optional: true,
    },
    EndDateTime: {
      type: "string",
      label: "End Date / Time",
      description: "The date/time when the event ends.",
      optional: true,
    },
    IsAllDayEvent: {
      type: "boolean",
      label: "All-Day Event",
      description: "Whether the event is an all-day event.",
      optional: true,
    },
    Location: {
      type: "string",
      label: "Location",
      description: "The location of the event.",
      optional: true,
    },
  },
  extraProps: {
    DeclinedEventInviteeIds: {
      ...commonProps.ContactOrLeadIds,
      label: "Declined Event Invitee IDs",
      description: "One or more Contact or Lead IDs who declined this event.",
      optional: true,
    },
    UndecidedEventInviteeIds: {
      ...commonProps.ContactOrLeadIds,
      label: "Undecided Event Invitee IDs",
      description: "One or more Contact or Lead IDs who are undecided about this event.",
      optional: true,
    },
    OwnerId: {
      ...commonProps.UserId,
      label: "Assigned to ID",
      description: "ID of the user or public calendar who owns the event.",
      optional: true,
    },
    IsPrivate: {
      type: "boolean",
      label: "Private",
      description:
        "If true, users other than the creator of the event can't see the event details when viewing the event user's calendar.",
      optional: true,
    },
    IsRecurrence: {
      type: "boolean",
      label: "Recurring Event",
      description:
        "Indicates whether a Salesforce Classic event is scheduled to repeat itself.",
      optional: true,
    },
    IsReminderSet: {
      type: "boolean",
      label: "Reminder Set",
      description: "Indicates whether the activity is a reminder.",
      optional: true,
    },
    IsVisibleInSelfService: {
      type: "boolean",
      label: "Visible in Self-Service",
      description:
        "Indicates whether an event associated with an object can be viewed in the Customer Portal.",
      optional: true,
    },
    RecurrenceDayOfMonth: {
      type: "integer",
      label: "Recurrence Day of Month",
      description: "The day of the month on which the event repeats.",
      optional: true,
    },
    RecurrenceDayOfWeekMask: {
      type: "integer[]",
      label: "Recurrence Day of Week",
      description: "The day(s) of the week on which the event repeats.",
      optional: true,
      options: WEEKDAY_MASK_OPTIONS,
    },
    RecurrenceEndDateOnly: {
      type: "string",
      label: "Recurrence End Date",
      description: "Indicates the last date on which the event repeats.",
      optional: true,
    },
    RecurrenceInstance: {
      type: "string",
      label: "Recurrence Instance",
      description:
        "Indicates the frequency of the Salesforce Classic event's recurrence.",
      optional: true,
      options: RECURRENCE_INSTANCE_OPTIONS,
    },
    RecurrenceInterval: {
      type: "integer",
      label: "Recurrence Interval",
      description:
        "Indicates the interval between Salesforce Classic recurring events.",
      optional: true,
    },
    RecurrenceMonthOfYear: {
      type: "string",
      label: "Recurrence Month of Year",
      description:
        "Indicates the month in which the Salesforce Classic recurring event repeats.",
      optional: true,
      options: RECURRENCE_MONTH_OPTIONS,
    },
    RecurrenceStartDateTime: {
      type: "string",
      label: "Recurrence Start Date / Time",
      description:
        "Indicates the date and time when the Salesforce Classic recurring event begins.",
      optional: true,
    },
    RecurrenceTimeZoneSidKey: {
      type: "string",
      label: "Recurrence Time Zone",
      description:
        "Indicates the time zone associated with a Salesforce Classic recurring event.",
      optional: true,
      options: TIMEZONE_OPTIONS,
    },
    RecurrenceType: {
      type: "string",
      label: "Recurrence Type",
      description: "Indicates how often the Salesforce Classic event repeats.",
      optional: true,
      options: RECURRENCE_TYPE_OPTIONS,
    },
    ReminderDateTime: {
      type: "string",
      label: "Reminder Date / Time",
      description: "Represents the time when the reminder is scheduled to fire",
      optional: true,
    },
    ShowAs: {
      type: "string",
      label: "Show As",
      description:
        "Indicates how this event appears when another user views the calendar.",
      optional: true,
      options: [
        {
          label: "Busy",
          value: "Busy",
        },
        {
          label: "Out of Office",
          value: "OutOfOffice",
        },
        {
          label: "Free",
          value: "Free",
        },
      ],
    },
    StartDateTime: {
      type: "string",
      label: "Start Date / Time",
      description: "Indicates the start date and time of the event.",
      optional: true,
    },
    Subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the event. Limit: 255 characters.",
      optional: true,
      options: [
        "Call",
        "Email",
        "Meeting",
        "Send Letter/Quote",
        "Other",
      ],
    },
  },
};
