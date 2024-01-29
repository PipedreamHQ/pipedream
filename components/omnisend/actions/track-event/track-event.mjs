import omnisend from "../../omnisend.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "omnisend-track-event",
  name: "Track Custom Event",
  description: "Log a custom event for better analytics and targeted marketing. [See the documentation](https://api-docs.omnisend.com/reference/post-events-eventid)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    omnisend,
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier for the custom event to log",
    },
    eventData: {
      type: "object",
      label: "Event Data",
      description: "The data associated with the event to log",
    },
  },
  async run({ $ }) {
    const response = await this.omnisend.logCustomEvent({
      eventId: this.eventId,
      data: this.eventData,
    });

    $.export("$summary", `Successfully logged custom event with ID: ${this.eventId}`);
    return response;
  },
};
