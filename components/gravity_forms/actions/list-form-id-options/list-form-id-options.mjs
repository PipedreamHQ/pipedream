import gravity_forms from "../../gravity_forms.app.mjs";

export default {
  key: "gravity_forms-list-form-id-options",
  name: "List Form ID Options",
  description: "Retrieves available options for the Form ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gravity_forms,
  },
  async run({ $ }) {
    const options = await gravity_forms.propDefinitions.formId.options.call(this.gravity_forms);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
