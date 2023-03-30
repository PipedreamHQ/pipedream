import app from "../../app/team_up.app";
import { defineAction } from "@pipedream/types";
import { DeleteEventParams } from "../../common/types";

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
        ({ calendarKey }) => ({
          calendarKey,
        }),
      ],
    },
  },
  async run({ $ }): Promise<object> {
    const {
      calendarKey, eventId,
    } = this;

    const params: DeleteEventParams = {
      $,
      calendarKey,
      eventId,
    };

    const data = await this.app.deleteEvent(params);
    $.export("$summary", "Successfully deleted event");
    return data;
  },
});
