import googleMeet from "../../google_meet.app.mjs";

export default {
  key: "google_meet-schedule-meeting",
  name: "Schedule Meeting",
  description: "Creates a new event in Google Calendar with a Google Meet link.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    googleMeet,
    calendar: {
      propDefinition: [
        googleMeet,
        "calendar",
      ],
    },
    eventTitle: {
      propDefinition: [
        googleMeet,
        "eventTitle",
      ],
      optional: true,
    },
    eventDescription: {
      propDefinition: [
        googleMeet,
        "eventDescription",
      ],
      optional: true,
    },
    eventStartDate: {
      propDefinition: [
        googleMeet,
        "eventStartDate",
      ],
    },
    eventEndDate: {
      propDefinition: [
        googleMeet,
        "eventEndDate",
      ],
    },
    attendees: {
      propDefinition: [
        googleMeet,
        "attendees",
      ],
      optional: true,
    },
    createMeetRoom: {
      propDefinition: [
        googleMeet,
        "createMeetRoom",
      ],
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleMeet.createEvent({
      calendarId: this.calendar,
      eventTitle: this.eventTitle,
      eventDescription: this.eventDescription,
      eventStartDate: this.eventStartDate,
      eventEndDate: this.eventEndDate,
      attendees: this.attendees,
      createMeetRoom: this.createMeetRoom,
    });
    $.export("$summary", `Scheduled meeting '${this.eventTitle}' successfully`);
    return response;
  },
};
