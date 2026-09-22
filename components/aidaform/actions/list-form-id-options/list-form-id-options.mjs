import aidaform from "../../aidaform.app.mjs";

export default {
  key: "aidaform-list-form-id-options",
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
    aidaform,
  },
  async run({ $ }) {
    const options = await aidaform.propDefinitions.formId.options.call(this.aidaform);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
