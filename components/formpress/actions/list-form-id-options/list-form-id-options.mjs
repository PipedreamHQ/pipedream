import formpress from "../../formpress.app.mjs";

export default {
  key: "formpress-list-form-id-options",
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
    formpress,
  },
  async run({ $ }) {
    const options = await formpress.propDefinitions.formId.options.call(this.formpress);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
