import workflowy from "../../workflowy.app.mjs";
import { POSITIONS } from "../../common/constants.mjs";

export default {
  key: "workflowy-create-node",
  name: "Create Node",
  description: "Creates a new bullet node in WorkFlowy via the beta API (POST /api/v1/nodes). Use this to add a top-level node or a child under an existing parent. To create a child node, first run **Search Nodes** to obtain a valid parent node ID and pass it as `parentNodeId`. Returns the newly created node's ID. [See the documentation](https://beta.workflowy.com/api-reference/#nodes-create).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    workflowy,
    name: {
      propDefinition: [
        workflowy,
        "name",
      ],
    },
    note: {
      propDefinition: [
        workflowy,
        "note",
      ],
    },
    parentNodeId: {
      type: "string",
      label: "Parent Node ID",
      description: "Free-form parent node ID under which to create this node. Leave blank to create a top-level node. To find a valid ID, first run **Search Nodes** and copy the `id` of the desired parent. Also accepts special values: `None` (root), `inbox`, `calendar`, `today`, `tomorrow`, `next_week`, or a date like `YYYY-MM-DD`.",
      optional: true,
    },
    layoutMode: {
      propDefinition: [
        workflowy,
        "layoutMode",
      ],
    },
    position: {
      type: "string",
      label: "Position",
      description: "Where to place the node among its siblings. One of `top` (default) or `bottom`.",
      options: POSITIONS,
      optional: true,
      default: "top",
    },
  },
  async run({ $ }) {
    const response = await this.workflowy.createNode({
      $,
      data: {
        name: this.name,
        note: this.note,
        parent_id: this.parentNodeId,
        layoutMode: this.layoutMode,
        position: this.position,
      },
    });
    const nodeId = response?.item_id ?? "unknown";
    $.export("$summary", `Created node "${this.name}" with ID ${nodeId}`);
    return response;
  },
};
