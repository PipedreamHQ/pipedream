import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-list-signature-options",
  name: "List Signature Options",
  description: "Retrieves available options for the Signature field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gmail,
  },
  async run({ $ }) {
    const options = await gmail.propDefinitions.signature.options.call(this.gmail);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
