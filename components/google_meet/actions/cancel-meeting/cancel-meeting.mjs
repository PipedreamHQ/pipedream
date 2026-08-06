// x-pd-ai: optimized
import googleMeet from "../../google_meet.app.mjs";

export default {
  key: "google_meet-cancel-meeting",
  name: "Cancel Meeting",
  description: "Cancel (delete) a scheduled meeting. This permanently removes the Calendar event and its Google Meet link. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/delete)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
    sendUpdates: {
      propDefinition: [
        googleMeet,
        "sendUpdates",
      ],
    },
  },
  async run({ $ }) {
    await this.googleMeet.deleteEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      sendUpdates: this.sendUpdates,
    });

    $.export("$summary", `Successfully cancelled meeting "${this.eventId}"`);

    return {
      success: true,
      eventId: this.eventId,
    };
  },
};
