import formsite from "../../formsite.app.mjs";

export default {
  key: "formsite-list-form-dir-options",
  name: "List Form Options",
  description: "Retrieves available options for the Form field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    formsite,
  },
  async run({ $ }) {
    const options = await formsite.propDefinitions.formDir.options.call(this.formsite);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
