import app from "../../hookdeck.app.mjs";

export default {
  name: "Retreive all Events",
  description: "This endpoint lists all events, or a subset of events. [See the documentation](https://hookdeck.com/api-ref#retrieve-all-events).",
  key: "hookdeck-retreive-all-events",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    eventId: {
      propDefinition: [
        app,
        "eventId",
      ],
      type: "string[]",
      label: "Events IDs",
      description: "Filter by event IDs.",
    },
    destinationId: {
      propDefinition: [
        app,
        "destinationId",
      ],
      description: "Filter by destination IDs.",
    },
    sourceId: {
      propDefinition: [
        app,
        "sourceId",
      ],
      description: "Filter by source IDs",
    },
    attempts: {
      propDefinition: [
        app,
        "attempts",
      ],
    },
    additionalProperties: {
      propDefinition: [
        app,
        "additionalProperties",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const MAX_RESULTS = this.limit ?? 1000;
    const data = [];
    let nextCursor = null;

    while (true) {
      const {
        models,
        pagination,
      } = await this.app.listEvents({
        status: this.status,
        id: this.eventId,
        destination_id: this.destinationId,
        source_id: this.sourceId,
        attempts: this.attempts,
        ...this.additionalProperties,
      });

      data.push(...models);
      nextCursor = pagination.next;

      if (!nextCursor || data.length >= MAX_RESULTS) {
        break;
      }
    }

    if (data.length > 0) {
      $.export("summary", `Successfully fetched ${data.length} event(s)`);
    } else {
      $.export("summary", "No events found");
    }
    return data.splice(0, MAX_RESULTS);
  },
};
