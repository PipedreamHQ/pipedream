import app from "../../langfuse.app.mjs";

export default {
  key: "langfuse-list-scores",
  name: "List Scores",
  description: "Retrieve a paginated list of scores from Langfuse with optional filters. [See the documentation](https://api.reference.langfuse.com/#tag/scores/GET/api/public/v2/scores).",
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
    userId: {
      type: "string",
      label: "User ID",
      description: "Filter scores by the external user identifier.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter scores by name (e.g. `quality`).",
      optional: true,
    },
    dataType: {
      type: "string",
      label: "Data Type",
      description: "Filter scores by data type. Accepted values include `NUMERIC`, `BOOLEAN`, and `CATEGORICAL`.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Filter scores by source. Accepted values include `API`, `REVIEW`, `ANNOTATION`, and `LLM`.",
      optional: true,
    },
    fromTimestamp: {
      type: "string",
      label: "From Timestamp",
      description: "Return scores created at or after this timestamp. Use ISO 8601 format (e.g. `2024-01-01T00:00:00Z`).",
      optional: true,
    },
    toTimestamp: {
      type: "string",
      label: "To Timestamp",
      description: "Return scores created before this timestamp. Use ISO 8601 format (e.g. `2024-12-31T23:59:59Z`).",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to retrieve (1-based). Defaults to the first page.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of scores to return per page. Min: 1, Max: 1000.",
      min: 1,
      max: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listScoresV2({
      $,
      params: {
        traceId: this.traceId,
        userId: this.userId,
        name: this.name,
        dataType: this.dataType,
        source: this.source,
        fromTimestamp: this.fromTimestamp,
        toTimestamp: this.toTimestamp,
        page: this.page,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} score(s)`);
    return response;
  },
};
