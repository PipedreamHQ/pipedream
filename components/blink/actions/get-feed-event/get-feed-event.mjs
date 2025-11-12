import app from "../../blink.app.mjs";

export default {
  name: "Get Feed Event",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "blink-get-feed-event",
  description: "Get a feed event by external ID. [See the documentation](https://developer.joinblink.com/reference/get-feed-event-id-by-external-id)",
  type: "action",
  props: {
    app,
    externalId: {
      type: "string",
      label: "External ID",
      description: "The event external ID.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getFeedEvent({
      $,
      params: {
        external_id: this.externalId,
      },
    });

    if (response?.data?.event_id) {
      $.export("$summary", `Successfully retrieved post to feed with event ID \`${response.data.event_id}\``);
    }

    return response;
  },
};
