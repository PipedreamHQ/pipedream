import neo4jAuradb from "../../neo4j_auradb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "neo4j_auradb-run-query",
  name: "Run Cypher Query",
  description: "Executes a Cypher query against the Neo4j AuraDB instance. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    neo4jAuradb,
    executeCypherQuery: {
      propDefinition: [
        neo4jAuradb,
        "executeCypherQuery",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.neo4jAuradb.executeCypherQuery({
      executeCypherQuery: this.executeCypherQuery,
    });
    $.export("$summary", "Executed Cypher query successfully");
    return response;
  },
};
