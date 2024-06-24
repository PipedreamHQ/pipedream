import { ConfigurationError } from "@pipedream/platform";
import app from "../../zoho_calendar.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoho_calendar-list-events",
  name: "List Events",
  description: "Returns a list of all the events in a particular calendar of the user. [See the documentation](https://www.zoho.com/calendar/help/api/get-events-list.html)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    calendarId: {
      propDefinition: [
        app,
        "calendarId",
      ],
    },
    start: {
      label: "Start Time",
      optional: true,
      propDefinition: [
        app,
        "dateTime",
      ],
    },
    end: {
      label: "End Time",
      optional: true,
      propDefinition: [
        app,
        "dateTime",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      calendarId,
      start,
      end,
    } = this;
    const params = {};

    if (start && !end || !start && end) {
      throw new ConfigurationError("You should provide the start and end date parameters.");
    }

    if (start && end) {
      params.range = JSON.stringify({
        start: utils.formatDateTime(start),
        end: utils.formatDateTime(end),
      });
    }

    const { events } = await app.listEvents({
      $,
      calendarId,
      params,
    });

    $.export("$summary", events[0]?.message || `Successfully fetched ${events.length} event(s)`);

    return events;
  },
};
