import app from "../../ical.app.mjs";
import ical2json from "ical2json";

export default {
  name: "Search Event",
  version: "0.0.1",
  key: "ical_search-event",
  description: "Search an event from a calendar. [See the documentation](https://icalendar.org/)",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      type: "string",
      label: "Search",
      description: "Search for an event",
    },
  },
  async run({ $ }) {
    const response = await this.app.getEvents({
      $,
    });

    const calendarData = ical2json.convert(response);

    if (!calendarData?.VCALENDAR?.length || !calendarData?.VCALENDAR[0].VEVENT?.length) {
      $.export("$summary", "No events found");
    }

    const event = calendarData?.VCALENDAR[0].VEVENT.find((event) =>
      event.SUMMARY?.toLowerCase().includes(this.search.toLowerCase()) ||
            event.DESCRIPTION?.toLowerCase().includes(this.search.toLowerCase()));

    if (event) {
      $.export("$summary", `Successfully retrieved event with summary \`${event.SUMMARY}\``);
    }

    return event;
  },
};
