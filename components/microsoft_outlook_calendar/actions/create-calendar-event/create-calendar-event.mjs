import app from "../../microsoft_outlook_calendar.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook_calendar-create-calendar-event",
  version: "0.0.5",
  name: "Create Calendar Event",
  description: "Create an event in the user's default calendar. [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-post-events)",
  props: {
    app,
    subject: {
      label: "Subject",
      description: "Subject of the event",
      type: "string",
    },
    contentType: {
      propDefinition: [
        app,
        "contentType",
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
      description: "Content",
    },
    timeZone: {
      propDefinition: [
        app,
        "timeZone",
      ],
    },
    start: {
      propDefinition: [
        app,
        "start",
      ],
    },
    end: {
      propDefinition: [
        app,
        "end",
      ],
    },
    attendees: {
      propDefinition: [
        app,
        "attendees",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    isOnlineMeeting: {
      propDefinition: [
        app,
        "isOnlineMeeting",
      ],
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      description: "Additional event details, [See object definition](https://docs.microsoft.com/en-us/graph/api/resources/event)",
    },
  },
  async run({ $ }) {
    //RegExp to check time strings(yyyy-MM-ddThh:mm:ss)
    const re = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)$/;
    if (!re.test(this.start) || !re.test(this.start)) {
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
      attendees: this.attendees.map((at) => ({
        emailAddress: {
          address: at,
        },
      })),
      isOnlineMeeting: this.isOnlineMeeting,
      ...this.expand,
    };
    const response = await this.app.createCalendarEvent({
      $,
      data,
    });
    $.export("$summary", "Calendar event has been created.");
    return response;
  },
};
