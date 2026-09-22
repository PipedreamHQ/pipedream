import fillout from "../../fillout.app.mjs";

export default {
  key: "fillout-list-form-id-options",
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
    fillout,
  },
  async run({ $ }) {
    const options = await fillout.propDefinitions.formId.options.call(this.fillout);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
