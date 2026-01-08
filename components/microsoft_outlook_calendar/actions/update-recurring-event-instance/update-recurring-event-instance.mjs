import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook_calendar-update-recurring-event-instance",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Update Recurring Event Instance",
  description: "Update an individual instance of a recurring event in the user's default calendar. [See the documentation](https://learn.microsoft.com/en-us/graph/api/event-update?view=graph-rest-1.0&tabs=http)",
  props: {
    microsoftOutlook,
    recurringEventId: {
      propDefinition: [
        microsoftOutlook,
        "recurringEventId",
      ],
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "The start of the time range to find instances, in ISO 8601 format (e.g., `2024-01-01T00:00:00Z`)",
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description: "The end of the time range to find instances, in ISO 8601 format (e.g., `2024-12-31T23:59:59Z`)",
    },
    instanceId: {
      propDefinition: [
        microsoftOutlook,
        "instanceId",
        (c) => ({
          recurringEventId: c.recurringEventId,
          startDateTime: c.startDateTime,
          endDateTime: c.endDateTime,
        }),
      ],
    },
    subject: {
      label: "Subject",
      description: "Subject of the event instance",
      type: "string",
      optional: true,
    },
    contentType: {
      propDefinition: [
        microsoftOutlook,
        "contentType",
      ],
      optional: true,
    },
    content: {
      propDefinition: [
        microsoftOutlook,
        "content",
      ],
      description: "Content",
      optional: true,
    },
    timeZone: {
      propDefinition: [
        microsoftOutlook,
        "timeZone",
      ],
      optional: true,
    },
    start: {
      propDefinition: [
        microsoftOutlook,
        "start",
      ],
      description: "New start date-time for this instance (yyyy-MM-ddThh:mm:ss)",
      optional: true,
    },
    end: {
      propDefinition: [
        microsoftOutlook,
        "end",
      ],
      description: "New end date-time for this instance (yyyy-MM-ddThh:mm:ss)",
      optional: true,
    },
    attendees: {
      propDefinition: [
        microsoftOutlook,
        "attendees",
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        microsoftOutlook,
        "location",
      ],
      optional: true,
    },
    isOnlineMeeting: {
      propDefinition: [
        microsoftOutlook,
        "isOnlineMeeting",
      ],
      optional: true,
    },
    expand: {
      propDefinition: [
        microsoftOutlook,
        "expand",
      ],
      description: "Additional event details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/event)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      subject: this.subject,
      isOnlineMeeting: this.isOnlineMeeting,
      ...this.expand,
    };

    if (this.location) {
      data.location = {
        displayName: this.location,
      };
    }

    if (this.content) {
      data.body = {
        contentType: this.contentType ?? "text",
        content: this.content,
      };
    }

    if (this.start && this.timeZone) {
      data.start = {
        dateTime: this.start,
        timeZone: this.timeZone,
      };
    }
    if (this.end && this.timeZone) {
      data.end = {
        dateTime: this.end,
        timeZone: this.timeZone,
      };
    }

    if (this.attendees) {
      data.attendees = this.attendees.map((at) => ({
        emailAddress: {
          address: at,
        },
      }));
    }

    const response = await this.microsoftOutlook.updateCalendarEvent({
      $,
      eventId: this.instanceId,
      data,
    });

    $.export("$summary", `Successfully updated recurring event instance with ID ${response.id}`);

    return response;
  },
};
