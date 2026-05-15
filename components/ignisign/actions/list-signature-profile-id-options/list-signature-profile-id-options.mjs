import ignisign from "../../ignisign.app.mjs";

export default {
  key: "ignisign-list-signature-profile-id-options",
  name: "List Signature Profile ID Options",
  description: "Retrieves available options for the Signature Profile ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ignisign,
  },
  async run({ $ }) {
    const options = await ignisign.propDefinitions.signatureProfileId.options.call(this.ignisign);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
