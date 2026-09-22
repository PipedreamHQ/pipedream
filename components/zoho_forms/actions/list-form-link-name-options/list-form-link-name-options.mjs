import zoho_forms from "../../zoho_forms.app.mjs";

export default {
  key: "zoho_forms-list-form-link-name-options",
  name: "List Form Link Name Options",
  description: "Retrieves available options for the Form Link Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_forms,
  },
  async run({ $ }) {
    const options = await zoho_forms.propDefinitions.formLinkName.options.call(this.zoho_forms);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
