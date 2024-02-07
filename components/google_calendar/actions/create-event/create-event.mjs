import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  key: "google_calendar-create-event",
  name: "Create Event",
  description: "Create an event to the Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#insert)",
  version: "0.2.0",
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    createMeetRoom: {
      label: "Create Meet Room",
      description: "Create a Google Meet room for this event.",
      type: "boolean",
      optional: true,
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

    const data = {
      calendarId: this.calendarId,
      sendUpdates: this.sendUpdates,
      sendNotifications: this.sendNotifications,
      resource: {
        summary: this.summary,
        location: this.location,
        description: this.description,
        start: this.getDateParam({
          date: this.eventStartDate,
          timeZone,
        }),
        end: this.getDateParam({
          date: this.eventEndDate,
          timeZone,
        }),
        recurrence: this.recurrence,
        attendees,
      },
    };

    if (this.createMeetRoom) {
      data.conferenceDataVersion = 1;
      data.resource.conferenceData = {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      };
    }

    const response = await this.googleCalendar.createEvent(data);

    $.export("$summary", `Successfully created event: "${response.id}"`);

    return response;
  },
};
