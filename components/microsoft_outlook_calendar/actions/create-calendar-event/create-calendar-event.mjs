import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook_calendar-create-calendar-event",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Calendar Event",
  description: "Create an event in the user's default calendar. Supports one-time and recurring events. [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-post-events) and [recurring event example](https://learn.microsoft.com/en-us/graph/api/user-post-events?view=graph-rest-1.0&tabs=http#example-3-create-a-recurring-event).",
  props: {
    microsoftOutlook,
    subject: {
      label: "Subject",
      description: "Subject of the event",
      type: "string",
    },
    contentType: {
      propDefinition: [
        microsoftOutlook,
        "contentType",
      ],
    },
    content: {
      propDefinition: [
        microsoftOutlook,
        "content",
      ],
      description: "Content",
    },
    timeZone: {
      propDefinition: [
        microsoftOutlook,
        "timeZone",
      ],
    },
    start: {
      propDefinition: [
        microsoftOutlook,
        "start",
      ],
    },
    end: {
      propDefinition: [
        microsoftOutlook,
        "end",
      ],
    },
    attendees: {
      propDefinition: [
        microsoftOutlook,
        "attendees",
      ],
    },
    location: {
      propDefinition: [
        microsoftOutlook,
        "location",
      ],
    },
    isOnlineMeeting: {
      propDefinition: [
        microsoftOutlook,
        "isOnlineMeeting",
      ],
    },
    expand: {
      propDefinition: [
        microsoftOutlook,
        "expand",
      ],
      description: "Additional event details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/event)",
    },
    recurrencePatternType: {
      propDefinition: [
        microsoftOutlook,
        "recurrencePatternType",
      ],
    },
    recurrenceInterval: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceInterval",
      ],
    },
    recurrenceDaysOfWeek: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceDaysOfWeek",
      ],
    },
    recurrenceDayOfMonth: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceDayOfMonth",
      ],
    },
    recurrenceMonth: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceMonth",
      ],
    },
    recurrenceRangeType: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceRangeType",
      ],
    },
    recurrenceEndDate: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceEndDate",
      ],
    },
    recurrenceNumberOfOccurrences: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceNumberOfOccurrences",
      ],
    },
  },
  async run({ $ }) {
    //RegExp to check time strings(yyyy-MM-ddThh:mm:ss)
    const re = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)$/;
    if (!re.test(this.start) || !re.test(this.end)) {
      throw new Error("Please provide both start and end props in 'yyyy-MM-ddThh:mm:ss'");
    }
    const data = {
      subject: this.subject,
      body: {
        contentType: this.contentType ?? "HTML",
        content: this.content,
      },
      start: {
        dateTime: this.start,
        timeZone: this.timeZone,
      },
      end: {
        dateTime: this.end,
        timeZone: this.timeZone,
      },
      location: {
        displayName: this.location,
      },
      attendees: this.attendees?.map((at) => ({
        emailAddress: {
          address: at,
        },
      })) ?? [],
      isOnlineMeeting: this.isOnlineMeeting,
      ...this.expand,
    };

    // Build recurrence when recurrence pattern type is set (create recurring event)
    if (this.recurrencePatternType) {
      if (!this.recurrenceInterval || this.recurrenceInterval < 1) {
        throw new Error("Recurrence Interval is required and must be at least 1 when creating a recurring event.");
      }
      const pattern = {
        type: this.recurrencePatternType,
        interval: this.recurrenceInterval,
      };
      if ([
        "weekly",
        "relativeMonthly",
        "relativeYearly",
      ].includes(this.recurrencePatternType) && this.recurrenceDaysOfWeek?.length) {
        pattern.daysOfWeek = this.recurrenceDaysOfWeek;
      }
      if ([
        "absoluteMonthly",
        "absoluteYearly",
      ].includes(this.recurrencePatternType) && this.recurrenceDayOfMonth != null) {
        pattern.dayOfMonth = this.recurrenceDayOfMonth;
      }
      if ([
        "absoluteYearly",
        "relativeYearly",
      ].includes(this.recurrencePatternType) && this.recurrenceMonth != null) {
        pattern.month = this.recurrenceMonth;
      }

      const startDateStr = this.start.slice(0, 10); // yyyy-MM-dd
      const range = {
        type: this.recurrenceRangeType ?? "noEnd",
        startDate: startDateStr,
      };
      if (this.recurrenceRangeType === "endDate" && this.recurrenceEndDate) {
        range.endDate = this.recurrenceEndDate;
      }
      if (this.recurrenceRangeType === "numbered" && this.recurrenceNumberOfOccurrences != null) {
        range.numberOfOccurrences = this.recurrenceNumberOfOccurrences;
      }

      data.recurrence = {
        pattern,
        range,
      };
    }

    const response = await this.microsoftOutlook.createCalendarEvent({
      $,
      data,
    });
    $.export("$summary", data.recurrence
      ? "Recurring calendar event has been created."
      : "Calendar event has been created.");
    return response;
  },
};
