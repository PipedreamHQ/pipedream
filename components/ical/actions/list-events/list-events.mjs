import app from "../../ical.app.mjs";

export default {
  name: "List Events",
  version: "0.0.1",
  key: "ical-list-events",
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

    if (!response?.VCALENDAR?.length) {
      $.export("$error", "No calendar events found");
    }

    const eventsQuantity = response?.VCALENDAR.length || 0;

    if (response) {
      $.export("$summary", `Successfully retrieved ${eventsQuantity} ${eventsQuantity <= 1
        ? "event"
        : "events"}`);
    }

    return response;
  },
};
