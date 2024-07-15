import commonProps from "../props.mjs";

export default {
  initialProps: {
    AcceptedEventInviteeIds: {
      ...commonProps.ContactOrLeadIds,
      label: "Accepted Event Invitee IDs",
      description: "One or more Contact or Lead IDs who accepted this event.",
      optional: true,
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
    OwnerId: {
      ...commonProps.UserId,
      label: "Assigned to ID",
      description: "ID of the user or public calendar who owns the event.",
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
      options: [
        {
          label: "Sunday",
          value: 1,
        },
        {
          label: "Monday",
          value: 2,
        },
        {
          label: "Tuesday",
          value: 4,
        },
        {
          label: "Wednesday",
          value: 8,
        },
        {
          label: "Thursday",
          value: 16,
        },
        {
          label: "Friday",
          value: 32,
        },
        {
          label: "Saturday",
          value: 64,
        },
      ],
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
      options: [
        {
          label: "1st",
          value: "First",
        },
        {
          label: "2nd",
          value: "Second",
        },
        {
          label: "3rd",
          value: "Third",
        },
        {
          label: "4th",
          value: "Fourth",
        },
        {
          label: "last",
          value: "Last",
        },
      ],
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
      options: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
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
      options: [
        {
          label: "(GMT+14:00) Line Islands Time (Pacific/Kiritimati)",
          value: "Pacific/Kiritimati",
        },
        {
          label: "(GMT+13:00) Phoenix Islands Time (Pacific/Enderbury)",
          value: "Pacific/Enderbury",
        },
        {
          label: "(GMT+13:00) Tonga Standard Time (Pacific/Tongatapu)",
          value: "Pacific/Tongatapu",
        },
        {
          label: "(GMT+12:45) Chatham Standard Time (Pacific/Chatham)",
          value: "Pacific/Chatham",
        },
        {
          label:
            "(GMT+12:00) Petropavlovsk-Kamchatski Standard Time (Asia/Kamchatka)",
          value: "Asia/Kamchatka",
        },
        {
          label: "(GMT+12:00) New Zealand Standard Time (Pacific/Auckland)",
          value: "Pacific/Auckland",
        },
        {
          label: "(GMT+12:00) Fiji Standard Time (Pacific/Fiji)",
          value: "Pacific/Fiji",
        },
        {
          label: "(GMT+11:00) Solomon Islands Time (Pacific/Guadalcanal)",
          value: "Pacific/Guadalcanal",
        },
        {
          label: "(GMT+11:00) Norfolk Island Standard Time (Pacific/Norfolk)",
          value: "Pacific/Norfolk",
        },
        {
          label: "(GMT+10:30) Lord Howe Standard Time (Australia/Lord_Howe)",
          value: "Australia/Lord_Howe",
        },
        {
          label:
            "(GMT+10:00) Australian Eastern Standard Time (Australia/Brisbane)",
          value: "Australia/Brisbane",
        },
        {
          label:
            "(GMT+10:00) Australian Eastern Standard Time (Australia/Sydney)",
          value: "Australia/Sydney",
        },
        {
          label:
            "(GMT+09:30) Australian Central Standard Time (Australia/Adelaide)",
          value: "Australia/Adelaide",
        },
        {
          label:
            "(GMT+09:30) Australian Central Standard Time (Australia/Darwin)",
          value: "Australia/Darwin",
        },
        {
          label: "(GMT+09:00) Korean Standard Time (Asia/Seoul)",
          value: "Asia/Seoul",
        },
        {
          label: "(GMT+09:00) Japan Standard Time (Asia/Tokyo)",
          value: "Asia/Tokyo",
        },
        {
          label: "(GMT+08:00) Hong Kong Standard Time (Asia/Hong_Kong)",
          value: "Asia/Hong_Kong",
        },
        {
          label: "(GMT+08:00) Malaysia Time (Asia/Kuala_Lumpur)",
          value: "Asia/Kuala_Lumpur",
        },
        {
          label: "(GMT+08:00) Philippine Standard Time (Asia/Manila)",
          value: "Asia/Manila",
        },
        {
          label: "(GMT+08:00) China Standard Time (Asia/Shanghai)",
          value: "Asia/Shanghai",
        },
        {
          label: "(GMT+08:00) Singapore Standard Time (Asia/Singapore)",
          value: "Asia/Singapore",
        },
        {
          label: "(GMT+08:00) Taipei Standard Time (Asia/Taipei)",
          value: "Asia/Taipei",
        },
        {
          label:
            "(GMT+08:00) Australian Western Standard Time (Australia/Perth)",
          value: "Australia/Perth",
        },
        {
          label: "(GMT+07:00) Indochina Time (Asia/Bangkok)",
          value: "Asia/Bangkok",
        },
        {
          label: "(GMT+07:00) Indochina Time (Asia/Ho_Chi_Minh)",
          value: "Asia/Ho_Chi_Minh",
        },
        {
          label: "(GMT+07:00) Western Indonesia Time (Asia/Jakarta)",
          value: "Asia/Jakarta",
        },
        {
          label: "(GMT+06:30) Myanmar Time (Asia/Rangoon)",
          value: "Asia/Rangoon",
        },
        {
          label: "(GMT+06:00) Bangladesh Standard Time (Asia/Dhaka)",
          value: "Asia/Dhaka",
        },
        {
          label: "(GMT+05:45) Nepal Time (Asia/Kathmandu)",
          value: "Asia/Kathmandu",
        },
        {
          label: "(GMT+05:30) India Standard Time (Asia/Colombo)",
          value: "Asia/Colombo",
        },
        {
          label: "(GMT+05:30) India Standard Time (Asia/Kolkata)",
          value: "Asia/Kolkata",
        },
        {
          label: "(GMT+05:00) Pakistan Standard Time (Asia/Karachi)",
          value: "Asia/Karachi",
        },
        {
          label: "(GMT+05:00) Uzbekistan Standard Time (Asia/Tashkent)",
          value: "Asia/Tashkent",
        },
        {
          label: "(GMT+05:00) Yekaterinburg Standard Time (Asia/Yekaterinburg)",
          value: "Asia/Yekaterinburg",
        },
        {
          label: "(GMT+04:30) Afghanistan Time (Asia/Kabul)",
          value: "Asia/Kabul",
        },
        {
          label: "(GMT+04:00) Azerbaijan Standard Time (Asia/Baku)",
          value: "Asia/Baku",
        },
        {
          label: "(GMT+04:00) Gulf Standard Time (Asia/Dubai)",
          value: "Asia/Dubai",
        },
        {
          label: "(GMT+04:00) Georgia Standard Time (Asia/Tbilisi)",
          value: "Asia/Tbilisi",
        },
        {
          label: "(GMT+04:00) Armenia Standard Time (Asia/Yerevan)",
          value: "Asia/Yerevan",
        },
        {
          label: "(GMT+03:00) Eastern European Standard Time (Africa/Cairo)",
          value: "Africa/Cairo",
        },
        {
          label: "(GMT+03:00) East Africa Time (Africa/Nairobi)",
          value: "Africa/Nairobi",
        },
        {
          label: "(GMT+03:00) Arabian Standard Time (Asia/Baghdad)",
          value: "Asia/Baghdad",
        },
        {
          label: "(GMT+03:00) Eastern European Summer Time (Asia/Beirut)",
          value: "Asia/Beirut",
        },
        {
          label: "(GMT+03:00) Israel Daylight Time (Asia/Jerusalem)",
          value: "Asia/Jerusalem",
        },
        {
          label: "(GMT+03:00) Arabian Standard Time (Asia/Kuwait)",
          value: "Asia/Kuwait",
        },
        {
          label: "(GMT+03:00) Arabian Standard Time (Asia/Riyadh)",
          value: "Asia/Riyadh",
        },
        {
          label: "(GMT+03:00) Eastern European Summer Time (Europe/Athens)",
          value: "Europe/Athens",
        },
        {
          label: "(GMT+03:00) Eastern European Summer Time (Europe/Bucharest)",
          value: "Europe/Bucharest",
        },
        {
          label: "(GMT+03:00) Eastern European Summer Time (Europe/Helsinki)",
          value: "Europe/Helsinki",
        },
        {
          label: "(GMT+03:00) Eastern European Standard Time (Europe/Istanbul)",
          value: "Europe/Istanbul",
        },
        {
          label: "(GMT+03:00) Moscow Standard Time (Europe/Minsk)",
          value: "Europe/Minsk",
        },
        {
          label: "(GMT+03:00) Moscow Standard Time (Europe/Moscow)",
          value: "Europe/Moscow",
        },
        {
          label: "(GMT+02:00) South Africa Standard Time (Africa/Johannesburg)",
          value: "Africa/Johannesburg",
        },
        {
          label: "(GMT+02:00) Central European Summer Time (Europe/Amsterdam)",
          value: "Europe/Amsterdam",
        },
        {
          label: "(GMT+02:00) Central European Summer Time (Europe/Berlin)",
          value: "Europe/Berlin",
        },
        {
          label: "(GMT+02:00) Central European Summer Time (Europe/Brussels)",
          value: "Europe/Brussels",
        },
        {
          label: "(GMT+02:00) Central European Summer Time (Europe/Paris)",
          value: "Europe/Paris",
        },
        {
          label: "(GMT+02:00) Central European Summer Time (Europe/Prague)",
          value: "Europe/Prague",
        },
        {
          label: "(GMT+02:00) Central European Summer Time (Europe/Rome)",
          value: "Europe/Rome",
        },
        {
          label: "(GMT+01:00) Central European Standard Time (Africa/Algiers)",
          value: "Africa/Algiers",
        },
        {
          label: "(GMT+01:00) Western European Summer Time (Africa/Casablanca)",
          value: "Africa/Casablanca",
        },
        {
          label: "(GMT+01:00) Irish Standard Time (Europe/Dublin)",
          value: "Europe/Dublin",
        },
        {
          label: "(GMT+01:00) Western European Summer Time (Europe/Lisbon)",
          value: "Europe/Lisbon",
        },
        {
          label: "(GMT+01:00) British Summer Time (Europe/London)",
          value: "Europe/London",
        },
        {
          label: "(GMT+00:00) Azores Summer Time (Atlantic/Azores)",
          value: "Atlantic/Azores",
        },
        {
          label: "(GMT+00:00) Greenwich Mean Time (GMT)",
          value: "GMT",
        },
        {
          label:
            "(GMT-01:00) East Greenland Summer Time (America/Scoresbysund)",
          value: "America/Scoresbysund",
        },
        {
          label: "(GMT-01:00) Cape Verde Standard Time (Atlantic/Cape_Verde)",
          value: "Atlantic/Cape_Verde",
        },
        {
          label: "(GMT-02:00) South Georgia Time (Atlantic/South_Georgia)",
          value: "Atlantic/South_Georgia",
        },
        {
          label: "(GMT-02:30) Newfoundland Daylight Time (America/St_Johns)",
          value: "America/St_Johns",
        },
        {
          label:
            "(GMT-03:00) Argentina Standard Time (America/Argentina/Buenos_Aires)",
          value: "America/Argentina/Buenos_Aires",
        },
        {
          label: "(GMT-03:00) Atlantic Daylight Time (America/Halifax)",
          value: "America/Halifax",
        },
        {
          label: "(GMT-03:00) Brasilia Standard Time (America/Sao_Paulo)",
          value: "America/Sao_Paulo",
        },
        {
          label: "(GMT-03:00) Atlantic Daylight Time (Atlantic/Bermuda)",
          value: "Atlantic/Bermuda",
        },
        {
          label: "(GMT-04:00) Venezuela Time (America/Caracas)",
          value: "America/Caracas",
        },
        {
          label:
            "(GMT-04:00) Eastern Daylight Time (America/Indiana/Indianapolis)",
          value: "America/Indiana/Indianapolis",
        },
        {
          label: "(GMT-04:00) Eastern Daylight Time (America/New_York)",
          value: "America/New_York",
        },
        {
          label: "(GMT-04:00) Atlantic Standard Time (America/Puerto_Rico)",
          value: "America/Puerto_Rico",
        },
        {
          label: "(GMT-04:00) Chile Standard Time (America/Santiago)",
          value: "America/Santiago",
        },
        {
          label: "(GMT-05:00) Colombia Standard Time (America/Bogota)",
          value: "America/Bogota",
        },
        {
          label: "(GMT-05:00) Central Daylight Time (America/Chicago)",
          value: "America/Chicago",
        },
        {
          label: "(GMT-05:00) Peru Standard Time (America/Lima)",
          value: "America/Lima",
        },
        {
          label: "(GMT-05:00) Eastern Standard Time (America/Panama)",
          value: "America/Panama",
        },
        {
          label: "(GMT-06:00) Mountain Daylight Time (America/Denver)",
          value: "America/Denver",
        },
        {
          label: "(GMT-06:00) Central Standard Time (America/El_Salvador)",
          value: "America/El_Salvador",
        },
        {
          label: "(GMT-06:00) Central Standard Time (America/Mexico_City)",
          value: "America/Mexico_City",
        },
        {
          label: "(GMT-07:00) Pacific Daylight Time (America/Los_Angeles)",
          value: "America/Los_Angeles",
        },
        {
          label: "(GMT-07:00) Mexican Pacific Standard Time (America/Mazatlan)",
          value: "America/Mazatlan",
        },
        {
          label: "(GMT-07:00) Mountain Standard Time (America/Phoenix)",
          value: "America/Phoenix",
        },
        {
          label: "(GMT-07:00) Pacific Daylight Time (America/Tijuana)",
          value: "America/Tijuana",
        },
        {
          label: "(GMT-08:00) Alaska Daylight Time (America/Anchorage)",
          value: "America/Anchorage",
        },
        {
          label: "(GMT-08:00) Pitcairn Time (Pacific/Pitcairn)",
          value: "Pacific/Pitcairn",
        },
        {
          label: "(GMT-09:00) Hawaii-Aleutian Daylight Time (America/Adak)",
          value: "America/Adak",
        },
        {
          label: "(GMT-09:00) Gambier Time (Pacific/Gambier)",
          value: "Pacific/Gambier",
        },
        {
          label: "(GMT-09:30) Marquesas Time (Pacific/Marquesas)",
          value: "Pacific/Marquesas",
        },
        {
          label: "(GMT-10:00) Hawaii-Aleutian Standard Time (Pacific/Honolulu)",
          value: "Pacific/Honolulu",
        },
        {
          label: "(GMT-11:00) Niue Time (Pacific/Niue)",
          value: "Pacific/Niue",
        },
        {
          label: "(GMT-11:00) Samoa Standard Time (Pacific/Pago_Pago)",
          value: "Pacific/Pago_Pago",
        },
      ],
    },
    RecurrenceType: {
      type: "string",
      label: "Recurrence Type",
      description: "Indicates how often the Salesforce Classic event repeats.",
      optional: true,
      options: [
        {
          label: "Recurs Daily",
          value: "RecursDaily",
        },
        {
          label: "Recurs Every Weekday",
          value: "RecursEveryWeekday",
        },
        {
          label: "Recurs Monthly",
          value: "RecursMonthly",
        },
        {
          label: "Recurs Monthly Nth",
          value: "RecursMonthlyNth",
        },
        {
          label: "Recurs Weekly",
          value: "RecursWeekly",
        },
        {
          label: "Recurs Yearly",
          value: "RecursYearly",
        },
        {
          label: "Recurs Yearly Nth",
          value: "RecursYearlyNth",
        },
      ],
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
    UndecidedEventInviteeIds: {
      ...commonProps.ContactOrLeadIds,
      label: "Undecided Event Invitee IDs",
      description: "One or more Contact or Lead IDs who are undecided about this event.",
      optional: true,
    },
  },
};
