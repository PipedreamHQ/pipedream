import googleMeet from "../../google_meet.app.mjs";

export default {
  key: "google_meet-get-meeting",
  name: "Get Meeting",
  description: "Get the details of a single meeting by its ID, including its Google Meet join link, attendees, and schedule. Returns the full Calendar event; the Meet join link is in the `hangoutLink` field when the event has one. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleMeet,
    calendarId: {
      propDefinition: [
        googleMeet,
        "calendarId",
      ],
    },
    eventId: {
      propDefinition: [
        googleMeet,
        "eventId",
      ],
    },
  },
  async run({ $ }) {
    const event = await this.googleMeet.getEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
    });

    $.export("$summary", `Retrieved meeting "${event.summary || event.id}"${event.hangoutLink
      ? ` (join link: ${event.hangoutLink})`
      : " (no Google Meet link on this event)"}`);

    return event;
  },
};
