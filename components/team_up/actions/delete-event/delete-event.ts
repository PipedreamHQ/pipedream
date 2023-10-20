import app from "../../app/team_up.app";
import { defineAction } from "@pipedream/types";
import { DeleteEventParams } from "../../common/requestParams";
import calendarKeyOptions from "../../common/calendarKeyOptions";
import { DeleteEventResponse } from "../../common/responseSchemas";

const DOCS_LINK = "https://apidocs.teamup.com/docs/api/260f3631bec7b-delete-an-event";

export default defineAction({
  name: "Delete Event",
  description: `Delete an event [See docs here](${DOCS_LINK})`,
  key: "team_up-delete-event",
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
  },
  async run({ $ }) {
    const {
      calendarKey, eventId,
    } = this;

    const params: DeleteEventParams = {
      $,
      calendarKey,
      eventId,
    };

    const data: DeleteEventResponse = await this.app.deleteEvent(params);
    $.export("$summary", "Successfully deleted event");
    return data;
  },
});
