import app from "../../ical.app.mjs";
import * as ical2json from "ical2json";

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
    calendarProtocol: {
      propDefinition: [
        app,
        "calendarProtocol",
      ],
    },
  },
  async run({ $ }) {
    let eventsQuantity, returnData;

    if (this.calendarProtocol === "ical") {
      const response = await this.app.getEventsIcal({
        $,
      });

      const calendarData = ical2json.convert(response);

      eventsQuantity = !calendarData || !calendarData?.VCALENDAR
        ? 0
        : calendarData?.VCALENDAR?.length;
      returnData = calendarData;
    } else {
      returnData = await this.app.getEvents({
        $,
      });

      eventsQuantity = !returnData || !returnData?.VCALENDAR
        ? 0
        : returnData?.VCALENDAR?.length;
    }

    if (!returnData?.VCALENDAR?.length) {
      $.export("$summary", "No calendar events found");
      return;
    }

    if (returnData) {
      $.export("$summary", `Successfully retrieved ${eventsQuantity} ${eventsQuantity <= 1
        ? "event"
        : "events"}`);
    }

    return returnData;
  },
};
