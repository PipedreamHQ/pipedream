import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook_calendar-update-calendar-event",
  version: "0.0.12",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Update Calendar Event",
  description: "Update an event in the user's default calendar. [See the documentation](https://learn.microsoft.com/en-us/graph/api/event-update?view=graph-rest-1.0&tabs=http)",
  props: {
    microsoftOutlook,
    eventId: {
      propDefinition: [
        microsoftOutlook,
        "eventId",
      ],
    },
    subject: {
      label: "Subject",
      description: "Subject of the event",
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
      description: "Body of the event, in plain text or HTML. Set Content Type to match, e.g. `Join us to discuss Q3 roadmap.` for Text, or `<p>Join us to discuss <b>Q3 roadmap</b>.</p>` for HTML.",
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
      optional: true,
    },
    end: {
      propDefinition: [
        microsoftOutlook,
        "end",
      ],
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

    if (this.contentType && this.content) {
      data.body = {
        contentType: this.contentType,
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
      eventId: this.eventId,
      data,
    });

    $.export("$summary", `Successfully updated calendar event with ID ${response.id}`);

    return response;
  },
};
