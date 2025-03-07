import neo4jAuradb from "../../neo4j_auradb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "neo4j_auradb-create-node",
  name: "Create Node",
  description: "Creates a new node in the Neo4j AuraDB instance. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    neo4jAuradb,
    createNodeLabel: {
      propDefinition: [
        neo4jAuradb,
        "createNodeLabel",
      ],
    },
    createNodeProperties: {
      propDefinition: [
        neo4jAuradb,
        "createNodeProperties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.neo4jAuradb.createNode({
      createNodeLabel: this.createNodeLabel,
      createNodeProperties: this.createNodeProperties,
    });

    const node = response.results?.[0]?.data?.[0]?.row?.[0];
    $.export("$summary", node
      ? `Created node with id ${node.id}`
      : "Node created successfully");
    return response;
  },
};
