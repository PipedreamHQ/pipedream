import app from "../../ironclad.app.mjs";

export default {
  key: "ironclad-get-workflow",
  name: "Get Workflow",
  description: "Returns the full detail of a single Ironclad workflow — schema, attribute values, status, roles, approvals, and signatures."
    + " Use when the workflow ID is already known. **When the ID isn't known**, use **Search Workflows** first to find it."
    + " Use this tool before **Update Workflow Attributes** to inspect the current attribute keys and values."
    + " [See the documentation](https://developer.ironcladapp.com/reference/retrieve-a-workflow)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to retrieve. Obtain via **Search Workflows**.",
    },
    hydrateEntities: {
      type: "boolean",
      label: "Hydrate Entities",
      description: "When true, expand referenced entity fields in the response.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.hydrateEntities) params.hydrateEntities = true;

    const response = await this.app.getWorkflow({
      $,
      workflowId: this.workflowId,
      params,
    });

    $.export("$summary", `Retrieved workflow ${this.workflowId}${response?.status
      ? ` (status: ${response.status})`
      : ""}`);

    return response;
  },
};
