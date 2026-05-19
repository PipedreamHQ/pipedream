import zoho_commerce from "../../zoho_commerce.app.mjs";

export default {
  key: "zoho_commerce-list-org-id-options",
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
    zoho_commerce,
  },
  async run({ $ }) {
    const options = await zoho_commerce.propDefinitions.orgId.options.call(this.zoho_commerce);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
