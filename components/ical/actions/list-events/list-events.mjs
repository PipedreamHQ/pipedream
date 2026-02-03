import app from "../../ical.app.mjs";
import ical2json from "ical2json";

export default {
  name: "List Events",
  version: "0.0.1",
  key: "ical_list-events",
  description: "List events from a calendar. [See the documentation](https://icalendar.org/)",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getEvents({
      $,
    });

    const calendarData = ical2json.convert(response);

    if (!calendarData?.VCALENDAR?.length) {
      $.export("$error", "No calendar events found");
    }

    const eventsQuantity = calendarData?.VCALENDAR[0].VEVENT?.length || 0;

    if (response) {
      $.export("$summary", `Successfully retrieved ${eventsQuantity} ${eventsQuantity <= 1
        ? "event"
        : "events"}`);
    }

    return calendarData;
  },
};
