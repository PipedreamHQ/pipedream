import app from "../../app/team_up.app";
import { defineAction } from "@pipedream/types";
import { ListEventsParams } from "../../common/requestParams";
import { Event } from "../../common/responseSchemas";

const DOCS_LINK = "https://apidocs.teamup.com/docs/api/0f9f896800ffe-get-events-collection-get-events-changed-search-events";

export default defineAction({
  name: "List Events",
  description: `Get a list of events based on search criteria [See docs here](${DOCS_LINK})`,
  key: "team_up-list-events",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    calendarKey: {
      propDefinition: [
        app,
        "calendarKey",
      ],
    },
  },
  async run({ $ }): Promise<Event[]> {
    const { calendarKey } = this;

    const params: ListEventsParams = {
      $,
      calendarKey,
    };

    const data: Event[] = await this.app.listEvents(params);
    $.export("$summary", `Successfully obtained ${data.length} events`);
    return data;
  },
});
