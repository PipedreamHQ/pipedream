import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";

export default {
  key: "google_calendar-create-event",
  name: "Create Event",
  description: "Create an event to the Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#insert)",
  version: "0.1.6",
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    ...createEventCommon.props({
      isUpdate: false,
    }),
  },
  methods: {
    ...createEventCommon.methods,
  },
  async run({ $ }) {
    const timeZone = this.getTimeZone(this.timeZone);
    const attendees = this.formatAttendees(this.attendees);

    const response = await this.googleCalendar.createEvent({
      calendarId: this.calendarId,
      sendUpdates: this.sendUpdates,
      sendNotifications: this.sendNotifications,
      resource: {
        summary: this.summary,
        location: this.location,
        description: this.description,
        start: this.getDateParam(this.eventStartDate, timeZone),
        end: this.getDateParam(this.eventEndDate, timeZone),
        attendees,
      },
    });

    $.export("$summary", `Successfully created event: "${response.id}"`);

    return response;
  },
};
