import options from "../../common/options.mjs";
import app from "../../hookdeck.app.mjs";

export default {
  name: "Retrieve all Requests",
  description: "This endpoint lists all request, or a subset of requests. Requests are sorted by `ingested_at` date. [See the documentation](https://hookdeck.com/api-ref#retrieve-all-requests).",
  key: "hookdeck-retrieve-all-requests",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    id: {
      type: "string[]",
      label: "Request ID",
      description: "Filter by requests IDs.",
      optional: true,
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
      type: "string",
      options: options.retrieveAllRequests.STATUS,
    },
    rejectionCause: {
      type: "string",
      label: "Rejection Cause",
      description: "Filter by rejection cause.",
      optional: true,
      options: options.retrieveAllRequests.REJECTION_CAUSE,
    },
    sourceId: {
      propDefinition: [
        app,
        "sourceId",
      ],
      description: "Filter by source IDs.",
    },
    path: {
      type: "string",
      label: "Path",
      description: "URL Encoded string of the value to match partially to the path.",
      optional: true,
    },
    ingestedAtInitialRange: {
      type: "string",
      label: "Ingested At Initial Range",
      description: "Filter by ingested at initial range. `YYYY-MM-DD` format.",
      optional: true,
    },
    ingestedAtFinalRange: {
      type: "string",
      label: "Ingested At Final Range",
      description: "Filter by ingested at final range. `YYYY-MM-DD` format.",
      optional: true,
    },
    orderBy: {
      propDefinition: [
        app,
        "orderBy",
      ],
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
      description: "Filter by additional properties. Check the [documentation](https://hookdeck.com/api-ref#retrieve-all-requests) for more details.",
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
      } = await this.app.listRequests({
        "status": this.status,
        "rejection_cause": this.rejectionCause,
        "source_id": this.sourceId,
        "path": this.path,
        "ingested_at[gte]": this.ingestedAtInitialRange,
        "ingested_at[lte]": this.ingestedAtFinalRange,
        "order_by": this.orderBy,
        "dir": this.orderByDir,
        "next": nextCursor,
        ...this.additionalProperties,
      }, $);

      data.push(...models);
      nextCursor = pagination.next;

      if (!nextCursor || data.length >= MAX_RESULTS) {
        break;
      }
    }

    if (data.length > 0) {
      $.export("summary", `Successfully fetched ${data.length} request(s)`);
    } else {
      $.export("summary", "No requests found");
    }
    return data.splice(0, MAX_RESULTS);
  },
};
