import { ConfigurationError } from "@pipedream/platform";
import app from "../../zoho_calendar.app.mjs";

export default {
  key: "zoho_calendar-list-events",
  name: "List Events",
  description: "Returns a list of all the events in a particular calendar of the user. [See the documentation](https://www.zoho.com/calendar/help/api/get-events-list.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    calendarId: {
      propDefinition: [
        app,
        "calendarId",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "When the `Start Date` parameter is passed, the events which occur between the given start and end dates are retrieved. It should contain the start and end parameters in UNIX date time format e.g. `yyyyMMddTHHmmssZ` or `yyyyMMdd` The range period cannot exceed 31 days.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "When the `End Date` parameter is passed, the events which occur between the given start and end dates are retrieved. It should contain the start and end parameters in UNIX date time format e.g. `yyyyMMddTHHmmssZ` or `yyyyMMdd` The range period cannot exceed 31 days.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      calendarId,
      startDate,
      endDate,
    } = this;
    const params = {};

    if (startDate && !endDate || !startDate && endDate) {
      throw new ConfigurationError("You should provide the start and end date parameters.");
    }

    if (startDate && endDate) {
      params.range = JSON.stringify({
        start: startDate,
        end: endDate,
      });
    }

    const { events } = await this.app.listEvents({
      $,
      calendarId,
      params,
    });

    $.export("$summary", events[0]?.message || `Successfully fetched ${events.length} event(s)`);

    return events;
  },
};
