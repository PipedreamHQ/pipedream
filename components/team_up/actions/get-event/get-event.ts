import app from "../../app/team_up.app";
import { defineAction } from "@pipedream/types";
import {
  Event, GetEventParams,
} from "../../common/requestParams";

const DOCS_LINK = "https://apidocs.teamup.com/docs/api/016e0077fd9cc-returns-a-single-event";

export default defineAction({
  name: "Get Event",
  description: `Get details of an event [See docs here](${DOCS_LINK})`,
  key: "team_up-get-event",
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
    eventId: {
      propDefinition: [
        app,
        "eventId",
        ({ calendarKey }) => ({
          calendarKey,
        }),
      ],
    },
  },
  async run({ $ }): Promise<Event> {
    const {
      calendarKey, eventId,
    } = this;

    const params: GetEventParams = {
      $,
      calendarKey,
      eventId,
    };

    const data: Event = await this.app.getEvent(params);
    $.export("$summary", `Successfully obtained event "${data.title}"`);
    return data;
  },
});
