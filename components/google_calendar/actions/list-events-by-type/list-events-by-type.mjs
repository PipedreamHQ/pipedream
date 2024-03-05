import googleCalendar from "../../google_calendar.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_calendar-list-events-by-type",
  name: "List Calendar Events by Type",
  description: "Retrieve a list of events filtered by type (\"default\", \"focusTime\", \"outOfOffice\", \"workingLocation\") from the Google Calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/list)",
  version: "0.0.1",
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    eventTypes: {
      propDefinition: [
        googleCalendar,
        "eventTypes",
      ],
    },
    maxResults: {
      propDefinition: [
        googleCalendar,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const args = utils.filterEmptyValues({
      calendarId: this.calendarId,
      eventTypes: this.eventTypes,
    });
    const events = [];
    let total, done = false, count = 0;
    do {
      const response = await this.googleCalendar.listEvents(args);
      for (const item of response.items) {
        events.push(item);
        count++;
        if (this.maxResults && count >= this.maxResults) {
          done = true;
          break;
        }
      }
      total = response.items?.length;
      args.syncToken = response.nextSyncToken;
    } while (total && !done);

    $.export("$summary", `Successfully retrieved ${events.length} event(s)`);

    return events;
  },
};
