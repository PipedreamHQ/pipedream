// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-get-workflow",
  name: "Get Workflow",
  description: "Retrieves the full Ironclad workflow object, including its schema and current attribute keys and types. Use the returned schema to construct a valid `updates` payload for **Update Workflow Attributes**. Run **Search Workflows** first to find a workflow ID. Example: set `workflowId` to `\"wf_xyz789\"` to retrieve a workflow with fields such as `id`, `title`, `status`, `currentStep`, and `attributes` (a map of attribute key → value). Use the optional `fields` param (e.g. `\"id,title,status\"`) to return only specific top-level keys. [See the documentation](https://developer.ironcladapp.com/reference/retrieve-a-workflow)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ironclad,
    workflowId: {
      propDefinition: [
        ironclad,
        "workflowId",
      ],
    },
    hydrateEntities: {
      type: "boolean",
      label: "Hydrate Entities",
      description: "Whether to expand referenced entities in the response. Defaults to `false`.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of top-level response keys to return (e.g. `id,title,status`). If omitted, the full response object is returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ironclad.getWorkflow({
      $,
      workflowId: this.workflowId,
      params: {
        hydrateEntities: this.hydrateEntities,
      },
    });
    $.export("$summary", `Retrieved workflow ${this.workflowId}`);
    if (this.fields) {
      const fieldList = this.fields.split(",").map((f) => f.trim())
        .filter(Boolean);
      const unknownFields = fieldList.filter((f) => !(f in response));
      if (unknownFields.length) {
        throw new ConfigurationError(`Unknown field(s) in \`fields\`: ${unknownFields.join(", ")}. Valid top-level keys for this workflow: ${Object.keys(response).join(", ")}.`);
      }
      return Object.fromEntries(
        fieldList.map((f) => [
          f,
          response[f],
        ]),
      );
    }
    return response;
  },
};
