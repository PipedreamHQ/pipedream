import signaturit from "../../signaturit.app.mjs";

export default {
  key: "signaturit-list-signature-request-id-options",
  name: "List Signature Request ID Options",
  description: "Retrieves available options for the Signature Request ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    signaturit,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await signaturit.propDefinitions.signatureRequestId.options
      .call(this.signaturit, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
