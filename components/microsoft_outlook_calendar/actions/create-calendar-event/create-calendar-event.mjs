import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook_calendar-create-calendar-event",
  version: "0.0.13",
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
      description: "Additional event details. "
        + "[See object definition](https://docs.microsoft.com/en-us/graph/api/resources/event)",
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
    recurrenceFirstDayOfWeek: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceFirstDayOfWeek",
      ],
    },
    recurrenceIndex: {
      propDefinition: [
        microsoftOutlook,
        "recurrenceIndex",
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
        throw new Error(
          "Recurrence Interval is required and must be at least 1 when creating a recurring event.",
        );
      }

      const patternType = this.recurrencePatternType;
      if ([
        "weekly",
        "relativeMonthly",
        "relativeYearly",
      ].includes(patternType)) {
        if (!this.recurrenceDaysOfWeek?.length) {
          throw new Error(
            `Recurrence Days of Week is required when pattern type is ${patternType}.`,
          );
        }
      }
      if ([
        "absoluteMonthly",
        "absoluteYearly",
      ].includes(patternType)) {
        const dom = this.recurrenceDayOfMonth;
        if (dom == null || dom < 1 || dom > 31) {
          throw new Error(
            `Recurrence Day of Month (1-31) is required when pattern type is ${patternType}.`,
          );
        }
      }
      if ([
        "absoluteYearly",
        "relativeYearly",
      ].includes(patternType)) {
        if (this.recurrenceMonth == null || this.recurrenceMonth < 1 || this.recurrenceMonth > 12) {
          throw new Error(
            `Recurrence Month (1-12) is required when pattern type is ${patternType}.`,
          );
        }
      }

      const rangeType = this.recurrenceRangeType ?? "noEnd";
      if (rangeType === "endDate") {
        if (!this.recurrenceEndDate || !/^\d{4}-\d{2}-\d{2}$/.test(this.recurrenceEndDate)) {
          throw new Error(
            "Recurrence End Date (yyyy-MM-dd) is required when range type is End by date.",
          );
        }
      }
      if (rangeType === "numbered") {
        if (this.recurrenceNumberOfOccurrences == null || this.recurrenceNumberOfOccurrences < 1) {
          throw new Error(
            "Recurrence Number of Occurrences is required (≥1) when range type is numbered.",
          );
        }
      }

      const pattern = {
        type: patternType,
        interval: this.recurrenceInterval,
      };
      if ([
        "weekly",
        "relativeMonthly",
        "relativeYearly",
      ].includes(patternType)) {
        pattern.daysOfWeek = this.recurrenceDaysOfWeek;
      }
      if (patternType === "weekly") {
        pattern.firstDayOfWeek = this.recurrenceFirstDayOfWeek ?? "sunday";
      }
      if ([
        "absoluteMonthly",
        "absoluteYearly",
      ].includes(patternType)) {
        pattern.dayOfMonth = this.recurrenceDayOfMonth;
      }
      if ([
        "absoluteYearly",
        "relativeYearly",
      ].includes(patternType)) {
        pattern.month = this.recurrenceMonth;
      }
      if ([
        "relativeMonthly",
        "relativeYearly",
      ].includes(patternType) && this.recurrenceIndex) {
        pattern.index = this.recurrenceIndex;
      }

      const startDateStr = this.start.slice(0, 10); // yyyy-MM-dd
      const range = {
        type: rangeType,
        startDate: startDateStr,
      };
      if (rangeType === "endDate") {
        range.endDate = this.recurrenceEndDate;
      }
      if (rangeType === "numbered") {
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
