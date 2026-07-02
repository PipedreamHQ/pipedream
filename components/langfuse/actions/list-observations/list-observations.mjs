import app from "../../langfuse.app.mjs";

export default {
  key: "langfuse-list-observations",
  name: "List Observations",
  description: "Retrieve a paginated list of observations from Langfuse with optional filters. [See the documentation](https://api.reference.langfuse.com/#tag/observations/GET/api/public/v2/observations).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    traceId: {
      propDefinition: [
        app,
        "traceId",
      ],
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filter by observation type (e.g., \"GENERATION\", \"SPAN\", \"EVENT\", \"AGENT\", \"TOOL\", \"CHAIN\", \"RETRIEVER\", \"EVALUATOR\", \"EMBEDDING\", \"GUARDRAIL\").",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter observations by name.",
      optional: true,
    },
    fromStartTime: {
      type: "string",
      label: "From Start Time",
      description: "Return observations that started at or after this timestamp. Use ISO 8601 format (e.g. `2024-01-01T00:00:00Z`).",
      optional: true,
    },
    toStartTime: {
      type: "string",
      label: "To Start Time",
      description: "Return observations that started before this timestamp. Use ISO 8601 format (e.g. `2024-12-31T23:59:59Z`).",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Base64-encoded cursor for pagination. Use the cursor from the previous response to get the next page.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of observations to return per page. Min: 1, Max: 1000.",
      min: 1,
      max: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listObservationsV2({
      $,
      params: {
        traceId: this.traceId,
        type: this.type,
        name: this.name,
        fromStartTime: this.fromStartTime,
        toStartTime: this.toStartTime,
        cursor: this.cursor,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} observation(s)`);
    return response;
  },
};
