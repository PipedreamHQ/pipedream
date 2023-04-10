import app from "../../app/team_up.app";
import { defineAction } from "@pipedream/types";
import { ListEventsParams } from "../../common/requestParams";
import { ListEventsResponse } from "../../common/responseSchemas";
import calendarKeyOptions from "../../common/calendarKeyOptions";

export const DOCS_LINK =
  "https://apidocs.teamup.com/docs/api/0f9f896800ffe-get-events-collection-get-events-changed-search-events";

export default defineAction({
  name: "List Events",
  description: `Get a list of events based on search criteria [See docs here](${DOCS_LINK})`,
  key: "team_up-list-events",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    calendarKey: {
      propDefinition: [
        app,
        "calendarKey",
      ],
    },
    subcalendarId: {
      propDefinition: [
        app,
        "subCalendarIds",
        calendarKeyOptions,
      ],
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description:
        "Query string used to search for events. See the [Search Guide](https://calendar.teamup.com/kb/searching-teamup-calendar/) for supported query syntax and features.",
      optional: true,
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
      optional: true,
      description:
        "The start of the date range to list events from, in `YYYY-MM-DD` format. Default is `today`.",
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
      optional: true,
      description:
        "The end of the date range to list events from (inclusive), in `YYYY-MM-DD` format. Default is `today+1day`.",
    },
  },
  async run({ $ }): Promise<ListEventsResponse> {
    const {
      calendarKey, subcalendarId, query, startDate, endDate,
    } = this;

    const params: ListEventsParams = {
      $,
      calendarKey,
      params: {
        subcalendarId,
        query,
        startDate,
        endDate,
      },
    };

    const data: ListEventsResponse = await this.app.listEvents(params);
    $.export("$summary", `Successfully obtained ${data.events.length} events`);
    return data;
  },
});
