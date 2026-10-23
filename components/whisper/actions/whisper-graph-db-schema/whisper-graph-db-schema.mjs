import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-db-schema",
  name: "Graph: Graph Schema Catalog (db.schema)",
  description: "List every node and relationship type in the graph with counts and examples. The self-describing schema: node/relationship types with counts, descriptions, examples, source/target labels and query best-practices - the map of what the graph holds. Runs the `db-schema` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/whisper-graph/schema)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "db-schema",
      values: {},
    });
    $.export("$summary", this.app.graphSummary("db-schema", result));
    return result;
  },
};
