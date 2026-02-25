import app from "../../ical.app.mjs";

export default {
  name: "Search Event",
  version: "0.0.1",
  key: "ical-search-event",
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

    if (!response?.VCALENDAR?.length || !response?.VCALENDAR[0].VEVENT?.length) {
      $.export("$summary", "No events found");
    }

    const event = response?.VCALENDAR.find((event) =>
      event.VEVENT[0].SUMMARY?.toLowerCase().includes(this.search.toLowerCase()) ||
            event.VEVENT[0].DESCRIPTION?.toLowerCase().includes(this.search.toLowerCase()));

    if (event) {
      $.export("$summary", `Successfully retrieved event with summary \`${event.SUMMARY}\``);
    }

    return event;
  },
};
