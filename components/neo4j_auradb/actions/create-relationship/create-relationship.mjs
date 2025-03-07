import neo4jAuradb from "../../neo4j_auradb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "neo4j_auradb-create-relationship",
  name: "Create Relationship",
  description: "Creates a relationship between two existing nodes. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    neo4jAuradb: {
      type: "app",
      app: "neo4j_auradb",
    },
    createRelationshipType: {
      propDefinition: [
        "neo4j_auradb",
        "createRelationshipType",
      ],
    },
    createStartNode: {
      propDefinition: [
        "neo4j_auradb",
        "createStartNode",
      ],
    },
    createEndNode: {
      propDefinition: [
        "neo4j_auradb",
        "createEndNode",
      ],
    },
    createRelationshipProperties: {
      propDefinition: [
        "neo4j_auradb",
        "createRelationshipProperties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.neo4jAuradb.createRelationship({
      createRelationshipType: this.createRelationshipType,
      createStartNode: this.createStartNode,
      createEndNode: this.createEndNode,
      createRelationshipProperties: this.createRelationshipProperties,
    });
    $.export(
      "$summary",
      `Created relationship '${this.createRelationshipType}' between nodes '${this.createStartNode}' and '${this.createEndNode}'`,
    );
    return response;
  },
};
