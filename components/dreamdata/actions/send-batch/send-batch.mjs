import dreamdata from "../../dreamdata.app.mjs";

export default {
  key: "dreamdata-send-batch",
  name: "Send Batch",
  description: "Submit a raw batch of Segment-spec events (`identify`, `track`, `page`, `group`, `alias`) to Dreamdata's ingestion API. Use this when you need full control over event shape. [See the documentation](https://developer.dreamdata.io/server-side/server-side-tracking/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dreamdata,
    events: {
      type: "string[]",
      label: "Events",
      description: "Array of event objects. Each entry must be a JSON object matching the Segment spec (must include a `type` and either `userId` or `anonymousId`). Max payload size is 500 KB per request.",
    },
    sentAt: {
      type: "string",
      label: "Sent At",
      description: "ISO-8601 timestamp when the batch was sent. Defaults to the current time if omitted.",
      optional: true,
    },
    messageId: {
      propDefinition: [
        dreamdata,
        "messageId",
      ],
    },
  },
  async run({ $ }) {
    const parsed = this.events.map((event, i) => {
      if (event && typeof event === "object") return event;
      try {
        return JSON.parse(event);
      } catch (err) {
        throw new Error(`Event at index ${i} is not valid JSON: ${err.message}`);
      }
    });
    const response = await this.dreamdata.sendBatch({
      $,
      events: parsed,
      sentAt: this.sentAt,
      messageId: this.messageId,
    });
    $.export("$summary", `Sent batch of ${parsed.length} event(s)`);
    return response;
  },
};
