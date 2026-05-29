import ignisign from "../../ignisign.app.mjs";

export default {
  key: "ignisign-list-signer-profile-id-options",
  name: "List Signer Profile ID Options",
  description: "Retrieves available options for the Signer Profile ID field.",
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
    const options = await ignisign.propDefinitions.signerProfileId.options.call(this.ignisign);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
