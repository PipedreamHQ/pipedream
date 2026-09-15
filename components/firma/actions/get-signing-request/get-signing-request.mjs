import firma from "../../firma.app.mjs";

export default {
  key: "firma-get-signing-request",
  name: "Get Signing Request",
  description: "Retrieves details of a specific signing request. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/get-signing-request)",
  version: "0.0.1",
  type: "action",
  props: {
    firma,
    signingRequestId: {
      propDefinition: [
        firma,
        "signingRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.firma.getSigningRequest({
      $,
      signingRequestId: this.signingRequestId,
    });
    $.export("$summary", `Successfully retrieved signing request "${response.name || this.signingRequestId}"`);
    return response;
  },
};
