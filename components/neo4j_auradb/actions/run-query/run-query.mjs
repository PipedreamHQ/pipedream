import app from "../../neo4j_auradb.app.mjs";

export default {
  key: "neo4j_auradb-run-query",
  name: "Run Cypher Query",
  description: "Executes a Cypher query against the Neo4j AuraDB instance. [See the documentation](https://neo4j.com/docs/query-api/current/query/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    cypherQuery: {
      type: "string",
      label: "Execute Cypher Query",
      description: "A valid Cypher query to execute against the Neo4j AuraDB instance.",
    },
  },
  async run({ $ }) {
    const response = await this.app.executeCypherQuery({
      $,
      cypherQuery: this.cypherQuery,
    });
    $.export("$summary", "Executed Cypher query successfully");
    return response;
  },
};
