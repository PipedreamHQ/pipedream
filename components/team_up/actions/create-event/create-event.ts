import app from "../../app/team_up.app";
import { defineAction } from "@pipedream/types";
import { CreateEventParams } from "../../common/requestParams";
import { Event } from "../../common/responseSchemas";
import {
  EVENT_PROPS, getEventProps,
} from "../../common/eventProps";
import calendarKeyOptions from "../../common/calendarKeyOptions";

const DOCS_LINK = "https://apidocs.teamup.com/docs/api/3269d0159ae9f-create-an-event";

export default defineAction({
  name: "Create Event",
  description: `Create an event [See docs here](${DOCS_LINK})`,
  key: "team_up-create-event",
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
    subCalendarIds: {
      propDefinition: [
        app,
        "subCalendarIds",
        calendarKeyOptions,
      ],
    },
    ...EVENT_PROPS,
  },
  async run({ $ }): Promise<Event> {
    const {
      calendarKey, subCalendarIds,
    } = this;

    const params: CreateEventParams = {
      $,
      calendarKey,
      data: {
        subcalendar_ids: subCalendarIds,
        ...getEventProps(),
      },
    };

    const data = await this.app.createEvent(params);
    const {
      id, title,
    } = data;

    $.export("$summary", `Successfully created event ${title
      ? `"${title}"`
      : id}`);

    return data;
  },
});
