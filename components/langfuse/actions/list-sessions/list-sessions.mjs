import app from "../../langfuse.app.mjs";

export default {
  key: "langfuse-list-sessions",
  name: "List Sessions",
  description: "Retrieve a paginated list of sessions from Langfuse with optional filters. [See the documentation](https://api.reference.langfuse.com/#tag/sessions/GET/api/public/sessions).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    fromTimestamp: {
      type: "string",
      label: "From Timestamp",
      description: "Return sessions created at or after this timestamp. Use ISO 8601 format (e.g. `2024-01-01T00:00:00Z`).",
      optional: true,
    },
    toTimestamp: {
      type: "string",
      label: "To Timestamp",
      description: "Return sessions created before this timestamp. Use ISO 8601 format (e.g. `2024-12-31T23:59:59Z`).",
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
      description: "The number of sessions to return per page. Min: 1, Max: 1000.",
      min: 1,
      max: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listSessions({
      $,
      params: {
        fromTimestamp: this.fromTimestamp,
        toTimestamp: this.toTimestamp,
        page: this.page,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} session(s)`);
    return response;
  },
};
