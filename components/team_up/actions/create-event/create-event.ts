import app from "../../app/team_up.app";
import { defineAction } from "@pipedream/types";
import { CreateEventParams } from "../../common/requestParams";
import { CreateEventResponse } from "../../common/responseSchemas";
import {
  EVENT_PROPS, getEventProps,
} from "../../common/eventProps";

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
    ...EVENT_PROPS,
  },
  methods: {
    getEventProps,
  },
  async run({ $ }) {
    const { calendarKey } = this;

    const params: CreateEventParams = {
      $,
      calendarKey,
      data: this.getEventProps(),
    };

    const data: CreateEventResponse = await this.app.createEvent(params);
    const {
      event: {
        id, title,
      },
    } = data;

    $.export("$summary", `Successfully created event ${title
      ? `"${title}"`
      : id}`);

    return data;
  },
});
