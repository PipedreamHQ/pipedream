import ignisign from "../../ignisign.app.mjs";

export default {
  key: "ignisign-list-signature-request-id-options",
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
    ignisign,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ignisign.propDefinitions.signatureRequestId.options.call(this.ignisign, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
