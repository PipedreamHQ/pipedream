import options from "../../common/options.mjs";
import app from "../../hookdeck.app.mjs";

export default {
  name: "Retrieve Request Events",
  description: "This endpoint retries the events associated with a request. [See the documentation](https://hookdeck.com/api-ref#retrieve-request-events).",
  key: "hookdeck-retrieve-request-events",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    requestId: {
      propDefinition: [
        app,
        "requestId",
      ],
      optional: false,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter by status.",
      optional: true,
      options: options.retrieveRequestEvents.STATUS,
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
    createdAtInitialRange: {
      propDefinition: [
        app,
        "createdAtInitalRange",
      ],
    },
    createdAtFinalRange: {
      propDefinition: [
        app,
        "createdAtFinalRange",
      ],
    },
    orderBy: {
      propDefinition: [
        app,
        "orderBy",
      ],
      options: options.retrieveRequestEvents.ORDER_BY,
    },
    orderByDir: {
      propDefinition: [
        app,
        "orderByDir",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    additionalProperties: {
      propDefinition: [
        app,
        "additionalProperties",
      ],
      description: "Filter by additional properties. Check the [documentation](https://hookdeck.com/api-ref#retrieve-request-events) for more details.",
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
      } = await this.app.listRequestEvents(this.requestId, {
        "status": this.status,
        "id": this.eventId,
        "destination_id": this.destinationId,
        "source_id": this.sourceId,
        "attempts": this.attempts,
        "created_at[gte]": this.createdAtInitialRange,
        "created_at[lte]": this.createdAtFinalRange,
        "order_by": this.orderBy,
        "dir": this.orderByDir,
        ...this.additionalProperties,
      }, $);

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
