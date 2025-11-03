import demio from "../../demio.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "demio-get-events",
  name: "Get Events",
  description: "Get all events by type. [See docs here](https://publicdemioapi.docs.apiary.io/#reference/events/events-list/events-list)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    demio,
    type: {
      label: "Event Type",
      description: "The type of the event",
      type: "string",
      options: constants.EVENT_TYPES,
    },
  },
  async run({ $ }) {
    const response = await this.demio.getEvents({
      $,
      params: {
        type: this.type,
      },
    });

    $.export("$summary", "Successfully retrieved events");

    return response;
  },
};
