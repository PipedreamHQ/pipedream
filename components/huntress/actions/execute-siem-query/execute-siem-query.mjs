import app from "../../huntress.app.mjs";

export default {
  key: "huntress-execute-siem-query",
  name: "Execute SIEM Query",
  description: "Execute an ESQL query against your Huntress SIEM logs and receive paginated JSON results. Queries must begin with `FROM logs`. Auto-paginates through all server pages (200 rows per page). [See the documentation](https://api.huntress.io/docs#tag/siem/post/v1/siem/query)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    esql: {
      type: "string",
      label: "ESQL Query",
      description: "ESQL query string (must begin with `FROM logs`).",
    },
    rangeStart: {
      type: "string",
      label: "Range Start",
      description: "Query range start (ISO 8601, e.g. `2026-01-01T00:00:00Z`).",
    },
    rangeEnd: {
      type: "string",
      label: "Range End",
      description: "Query range end (ISO 8601, e.g. `2026-01-02T00:00:00Z`).",
    },
  },
  async run({ $ }) {
    const logs = await this.app.paginateSiemQuery({
      $,
      esql: this.esql,
      rangeStart: this.rangeStart,
      rangeEnd: this.rangeEnd,
    });

    $.export("$summary", `Successfully executed SIEM query (\`${logs.length}\` log record(s) returned)`);

    return logs;
  },
};
