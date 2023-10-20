import app from "../../app/team_up.app";
import { defineAction } from "@pipedream/types";
import { UpdateEventParams } from "../../common/requestParams";
import { UpdateEventResponse } from "../../common/responseSchemas";
import {
  EVENT_PROPS, getEventProps,
} from "../../common/eventProps";
import calendarKeyOptions from "../../common/calendarKeyOptions";

const DOCS_LINK = "https://apidocs.teamup.com/docs/api/8b5d0d1556103-update-an-event";

export default defineAction({
  name: "Update Event",
  description: `Update an event [See docs here](${DOCS_LINK})`,
  key: "team_up-update-event",
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
        calendarKeyOptions,
      ],
    },
    ...EVENT_PROPS,
  },
  methods: {
    getEventProps,
  },
  async run({ $ }) {
    const {
      calendarKey, eventId,
    } = this;

    const params: UpdateEventParams = {
      $,
      calendarKey,
      eventId,
      data: {
        id: eventId,
        ...this.getEventProps(),
      },
    };

    const data: UpdateEventResponse = await this.app.updateEvent(params);
    const { event: { title } } = data;

    $.export("$summary", `Successfully updated event ${title
      ? `"${title}"`
      : eventId}`);

    return data;
  },
});
