import { parseObject } from "../../common/utils.mjs";
import app from "../../neo4j_auradb.app.mjs";

export default {
  key: "neo4j_auradb-create-relationship",
  name: "Create Relationship",
  description: "Creates a relationship between two existing nodes. [See the documentation](https://neo4j.com/docs/query-api/current/query/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    relationshipType: {
      type: "string",
      label: "Create Relationship Type",
      description: "The name of the relationship to create.",
    },
    startNode: {
      type: "object",
      label: "Start Node Identifier",
      description: "An object containing any fields used to identify the start node.",
    },
    endNode: {
      type: "object",
      label: "End Node Identifier",
      description: "An object containing any fields used to identify the end node.",
    },
    relationshipProperties: {
      type: "object",
      label: "Create Relationship Properties",
      description: "An object representing the properties of the relationship to create.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createRelationship({
      $,
      relationshipType: this.relationshipType,
      startNode: parseObject(this.startNode),
      endNode: parseObject(this.endNode),
      relationshipProperties: parseObject(this.relationshipProperties),
    });
    $.export(
      "$summary",
      `Created relationship '${this.relationshipType}' between nodes`,
    );
    return response;
  },
};
