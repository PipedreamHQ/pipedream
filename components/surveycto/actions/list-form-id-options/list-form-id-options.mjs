import surveycto from "../../surveycto.app.mjs";

export default {
  key: "surveycto-list-form-id-options",
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
    surveycto,
  },
  async run({ $ }) {
    const options = await surveycto.propDefinitions.formId.options.call(this.surveycto);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
