import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-run-cypher",
  name: "Graph: Run Cypher",
  description: "Run arbitrary Cypher against the whisper.security graph (the raw escape hatch under every named recipe). POSTs `{query, parameters}` to the graph query API and returns the `{columns, rows, statistics}` envelope, where rows are objects keyed by column name. Bind user input as `$parameters` (never string-concatenate it) so a query is always injection-safe. Keyed - connect your Whisper API key. [See the documentation](https://www.whisper.security/docs/cypher-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    cypher: {
      type: "string",
      label: "Cypher",
      description: "The Cypher query to run, e.g. `CALL whisper.identify([$v]) YIELD canonical_name, category` or `RETURN 1 AS n`. Reference inputs as `$name` and supply them under **Parameters**. [Docs](https://www.whisper.security/docs/cypher-api)",
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "The `$`-parameters referenced by the query, as a JSON object, e.g. `{ \"v\": \"api.openai.com\" }`. Values are bound (never interpolated), so hostile input can never escape the query. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
  },
  async run({ $ }) {
    const result = await this.app.graphQuery({
      $,
      cypher: this.cypher,
      params: this.parameters,
    });
    $.export("$summary", `Ran Cypher (${result.rows?.length ?? 0} rows)`);
    return result;
  },
};
