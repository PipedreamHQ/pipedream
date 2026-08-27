// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-workflow-id-options",
  name: "List Workflow ID Options",
  description: "Returns one page of Ironclad workflows as `{label, value}` pairs (where `value` is the workflow ID). Call this before running **Get Workflow** or **Update Workflow Attributes** to find a valid `workflowId`. **Search Workflows** is the primary way to find a workflow by attribute values; use this action only to page through the full list or when resolving the `workflowId` prop directly. Results are 0-indexed by page; if the response contains the maximum number of items, increment `page` and call again to fetch more. Example return: `[{\"label\": \"Acme NDA Review\", \"value\": \"wf_xyz789\"}, ...]`. [See the documentation](https://developer.ironcladapp.com/reference/list-workflows)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ironclad,
    page: {
      type: "integer",
      label: "Page",
      description: "The 0-indexed page of results to retrieve. Increment and call again if the previous response contained the maximum number of items.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ironclad.propDefinitions.workflowId.options.call(this.ironclad, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
