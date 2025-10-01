import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "google_calendar-quick-add-event",
  name: "Add Quick Event",
  description: "Create a quick event to the Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#quickAdd)",
  version: "0.1.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    text: {
      type: "string",
      label: "Describe Event",
      description: "Write a plain text description of event, and Google will parse this string to create the event. eg. 'Meet with Michael 10am 7/22/2024' or 'Call Sarah at 1:30PM on Friday'",
    },
    attendees: {
      label: "Attendees",
      type: "string",
      description: "Enter either an array or a comma separated list of email addresses of attendees",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.calendarId) {
      throw new ConfigurationError("Calendar ID prop is missing or empty. Please provide a valid string representing the calendar's identifier. For example, 'primary' or an email address such as 'user@example.com'");
    }

    const response = await this.googleCalendar.quickAddEvent({
      calendarId: this.calendarId,
      text: this.text,
    });

    if (this.attendees) {
      const update = await this.googleCalendar.updateEvent({
        calendarId: this.calendarId,
        eventId: response.id,
        requestBody: {
          ...response,
          attendees: createEventCommon.methods.formatAttendees(this.attendees),
        },
      });
      response.attendees = update.attendees;
    }

    $.export("$summary", `Successfully added a quick event: "${response.id}"`);

    return response;
  },
};
