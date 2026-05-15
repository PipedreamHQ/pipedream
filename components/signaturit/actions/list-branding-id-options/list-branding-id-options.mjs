import signaturit from "../../signaturit.app.mjs";

export default {
  key: "signaturit-list-branding-id-options",
  name: "List Branding ID Options",
  description: "Retrieves available options for the Branding ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    signaturit,
  },
  async run({ $ }) {
    const options = await signaturit.propDefinitions.brandingId.options.call(this.signaturit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
