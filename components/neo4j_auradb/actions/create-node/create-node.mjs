import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import app from "../../neo4j_auradb.app.mjs";

export default {
  key: "neo4j_auradb-create-node",
  name: "Create Node",
  description: "Creates a new node in the Neo4j AuraDB instance. [See the documentation](https://neo4j.com/docs/query-api/current/query/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    nodeLabel: {
      type: "string",
      label: "Node Label",
      description: "The label of the node to filter events for new node creation.",
    },
    nodeProperties: {
      type: "object",
      label: "Create Node Properties",
      description: "An object representing the properties of the node to create.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createNode({
      $,
      label: this.nodeLabel,
      properties: parseObject(this.nodeProperties),
    });

    if (response.errors) {
      throw new ConfigurationError(response.errors[0].message);
    }

    const elementId = response.data?.values?.[0]?.[0]?.elementId;
    $.export("$summary", elementId
      ? `Created node with id ${elementId}`
      : "Node created successfully");
    return response;
  },
};
