import signpath from "../../signpath.app.mjs";

export default {
  key: "signpath-get-signing-request-data",
  name: "Get Signing Request Data",
  description: "Get data for a specific signing request. [See the documentation](https://docs.signpath.io/build-system-integration#get-signing-request-data)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    signpath,
    signingRequestId: {
      type: "string",
      label: "Signing Request ID",
      description: "The ID of the signing request to get data for",
    },
  },
  async run({ $ }) {
    const response = await this.signpath.getSigningRequestData({
      signingRequestId: this.signingRequestId,
      $,
    });
    $.export("$summary", `Successfully retrieved signing request data for ID: ${this.signingRequestId}`);
    return response;
  },
};
