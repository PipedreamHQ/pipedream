// x-pd-ai: optimized
import googleMeet from "../../google_meet.app.mjs";

export default {
  key: "google_meet-list-calendars",
  name: "List Calendars",
  description: "List the calendars in the connected Google account, including each calendar's ID. [See the documentation](https://developers.google.com/calendar/api/v3/reference/calendarList/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleMeet,
  },
  async run({ $ }) {
    const calendars = [];
    let pageToken;

    do {
      const response = await this.googleMeet.listCalendars({
        pageToken,
      });
      calendars.push(...(response.items || []));
      pageToken = response.nextPageToken;
    } while (pageToken);

    $.export("$summary", `Found ${calendars.length} calendar${calendars.length === 1
      ? ""
      : "s"}`);

    return calendars;
  },
};
