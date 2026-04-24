import { ConfigurationError } from "@pipedream/platform";
import app from "../../ironclad.app.mjs";
import { parseValue } from "../../common/utils.mjs";

export default {
  key: "ironclad-update-workflow-attributes",
  name: "Update Workflow Attributes",
  description: "Updates attribute values on an in-flight Ironclad workflow."
    + " **Use Get Workflow first** to inspect the workflow's current attribute keys, and **Describe Workflow Template** for the expected value shapes."
    + " Pass `updates` as a JSON object keyed by attribute key — this tool converts it to Ironclad's internal `[{action: 'set', path, value}]` array."
    + " Example: `{\"counterpartyName\": \"Acme Corp\", \"contractValue\": {\"currency\": \"USD\", \"amount\": 50000}}`."
    + " [See the documentation](https://developer.ironcladapp.com/reference/update-workflow-attributes)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to update. Obtain via **Search Workflows**.",
    },
    updates: {
      type: "string",
      label: "Updates",
      description: "JSON object of attribute key-value pairs to set on the workflow."
        + " Example: `{\"counterpartyName\": \"Acme Corp\"}`. Use **Get Workflow** to see current values and **Describe Workflow Template** for value shapes.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Optional comment describing the update.",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedUpdates = parseValue(this.updates) ?? {};
    if (
      typeof parsedUpdates !== "object"
      || parsedUpdates === null
      || Array.isArray(parsedUpdates)
    ) {
      throw new ConfigurationError("`updates` must be a JSON object keyed by workflow attribute key. Example: `{\"counterpartyName\":\"Acme Corp\"}`.");
    }

    const updates = Object.entries(parsedUpdates).map(([
      path,
      value,
    ]) => ({
      action: "set",
      path,
      value,
    }));

    const response = await this.app.updateWorkflowMetadata({
      $,
      workflowId: this.workflowId,
      data: {
        updates,
        ...(this.comment
          ? {
            comment: this.comment,
          }
          : {}),
      },
    });

    $.export("$summary", `Updated ${updates.length} attribute(s) on workflow ${this.workflowId}`);
    return response;
  },
};
