// x-pd-ai: optimized
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-template-id-options",
  name: "List Template ID Options",
  description: "Retrieves `{ label, value }` pairs for populating a Template dropdown, across every workspace."
    + " This is a form helper, not a Smartsheet capability: it returns only template names and IDs."
    + " Prefer **List Workspace Templates**, which returns the same templates with their workspace context."
    + " Note this walks every workspace's children, so it is slow on large accounts."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
  },
  async run({ $ }) {
    const options = await smartsheet.propDefinitions.templateId.options.call(this.smartsheet, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
