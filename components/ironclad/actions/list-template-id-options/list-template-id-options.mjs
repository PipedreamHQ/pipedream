import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-template-id-options",
  name: "List Template ID Options",
  description: "Returns Ironclad workflow template IDs and their display names as `{label, value}` pairs. Call this before running **Launch Workflow** or **Describe Workflow Template** to find a valid `templateId`. Results are 0-indexed by page; if the response contains the maximum number of items, increment `page` and call again to fetch more. Example return: `[{\"label\": \"NDA Template\", \"value\": \"tmpl_abc123\"}, {\"label\": \"Vendor Agreement\", \"value\": \"tmpl_xyz789\"}, ...]`. [See the documentation](https://developer.ironcladapp.com/reference/list-all-workflow-schemas)",
  version: "0.1.1",
  type: "action",
  ai: "optimized",
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
      optional: true,
    },
  },
  async run({ $ }) {
    const { list } = await this.ironclad.listWorkflowSchemas({
      $,
      params: {
        page: this.page,
      },
    });
    const options = list?.map(({
      id: value, name: label,
    }) => ({
      value,
      label,
    })) || [];
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
