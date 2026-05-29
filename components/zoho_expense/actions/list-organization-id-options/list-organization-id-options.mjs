import zoho_expense from "../../zoho_expense.app.mjs";

export default {
  key: "zoho_expense-list-organization-id-options",
  name: "List Organization ID Options",
  description: "Retrieves available options for the Organization ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_expense,
  },
  async run({ $ }) {
    const options = await zoho_expense.propDefinitions.organizationId.options
      .call(this.zoho_expense);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
