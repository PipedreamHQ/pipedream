import app from "../../ical.app.mjs";
import ical2json from "ical2json";

export default {
  name: "Search Events",
  version: "0.0.1",
  key: "ical-search-events",
  description: "Search for events from a calendar. [See the documentation](https://icalendar.org/)",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    calendarProtocol: {
      propDefinition: [
        app,
        "calendarProtocol",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search for an event",
    },
  },
  async run({ $ }) {
    let data;

    if (this.calendarProtocol === "ical") {
      const response = await this.app.getEventsIcal({
        $,
      });

      const calendarData = ical2json.convert(response);

      data = calendarData;
    } else {
      data = await this.app.getEvents({
        $,
      });
    }

    if (!data?.VCALENDAR?.length || !data?.VCALENDAR[0].VEVENT?.length) {
      $.export("$summary", "No events found");
      return;
    }

    const events = data?.VCALENDAR.filter((event) =>
      event.VEVENT[0].SUMMARY?.toLowerCase().includes(this.search.toLowerCase()) ||
      event.VEVENT[0].DESCRIPTION?.toLowerCase().includes(this.search.toLowerCase()));

    if (events.length) {
      $.export("$summary", `Successfully find ${events.length} events`);
      return;
    }

    return events;
  },
};
