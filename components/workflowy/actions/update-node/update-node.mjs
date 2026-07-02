import { ConfigurationError } from "@pipedream/platform";
import workflowy from "../../workflowy.app.mjs";

export default {
  key: "workflowy-update-node",
  name: "Update Node",
  description: "Updates an existing WorkFlowy node's name, note, and/or layout mode (POST /api/v1/nodes/:id). Run **Search Nodes** first to obtain the target node ID. At least one of name, note, or layout mode must be provided. Note that the update endpoint only returns a status, not the full updated node. [See the documentation](https://beta.workflowy.com/api-reference/#nodes-update).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    workflowy,
    nodeId: {
      type: "string",
      label: "Node ID",
      description: "The ID of the node to update. Run **Search Nodes** to find a valid node ID.",
    },
    name: {
      propDefinition: [
        workflowy,
        "name",
      ],
      description: "New main text for the node. Provide at least one of name, note, or layout mode.",
      optional: true,
    },
    note: {
      propDefinition: [
        workflowy,
        "note",
      ],
      description: "New note (secondary text) for the node. Provide at least one of name, note, or layout mode.",
      optional: true,
    },
    layoutMode: {
      propDefinition: [
        workflowy,
        "layoutMode",
      ],
    },
  },
  async run({ $ }) {
    if (this.name === undefined && this.note === undefined && this.layoutMode === undefined) {
      throw new ConfigurationError("At least one of Name, Note, or Layout Mode must be provided.");
    }

    const updatedNode = await this.workflowy.updateNode({
      $,
      nodeId: this.nodeId,
      data: {
        name: this.name,
        note: this.note,
        layoutMode: this.layoutMode,
      },
    });

    $.export("$summary", `Updated node ${this.nodeId}`);
    return updatedNode;
  },
};
