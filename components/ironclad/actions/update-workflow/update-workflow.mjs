import ironclad from "../../ironclad.app.mjs";
import { WORKFLOW_ATTRIBUTE_UPDATE_ACTION } from "../../common/constants.mjs";
import { parseJsonObject } from "../../common/utils.mjs";

export default {
  key: "ironclad-update-workflow",
  name: "Update Workflow Attributes",
  description: "Updates attribute values on an in-flight Ironclad workflow. The workflow must be in the Review step; document/file-type attributes are not supported. Provide `updates` as a flat JSON object of attribute key to new value — each pair is converted to Ironclad's internal `{action: \"set\", path, value}` update format automatically. Run **Search Workflows** or **Get Workflow** first to find the `workflowId`, then run **Get Workflow** to see current attribute keys and values, or **Describe Workflow Template** for the attribute format reference (complex types like `monetaryAmount`, `address`, `date`, `duration`). Example: set `workflowId` to `\"wf_xyz789\"` and `updates` to `{\"contractValue\": {\"currency\": \"USD\", \"amount\": 75000}, \"renewalDate\": \"2027-01-01\"}`; the action confirms the update was applied. [See the documentation](https://developer.ironcladapp.com/reference/update-workflow-metadata)",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    ironclad,
    workflowId: {
      propDefinition: [
        ironclad,
        "workflowId",
      ],
    },
    updates: {
      type: "string",
      label: "Updates",
      description: "JSON object of attribute key to new-value pairs to set on the workflow. Run **Get Workflow** first to discover current attribute keys and types, and **Describe Workflow Template** for complex-type value shapes. Example: `{\"contractValue\": {\"currency\": \"USD\", \"amount\": 75000}, \"renewalDate\": \"2027-01-01\"}`.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment explaining the updates being made to the workflow.",
      optional: true,
    },
  },
  async run({ $ }) {
    const updates = parseJsonObject(this.updates, "Updates");
    const response = await this.ironclad.updateWorkflowMetadata({
      $,
      workflowId: this.workflowId,
      data: {
        updates: Object.entries(updates).map(([
          key,
          value,
        ]) => ({
          action: WORKFLOW_ATTRIBUTE_UPDATE_ACTION,
          path: key,
          value,
        })),
        comment: this.comment,
      },
    });
    $.export("$summary", `Workflow ${this.workflowId} updated successfully`);
    return response;
  },
};
