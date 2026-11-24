import firma from "../../firma.app.mjs";

export default {
  key: "firma-get-signing-request",
  name: "Get Signing Request",
  description: "Retrieves one Firma signing request by its UUID: name, status flags (`status.sent`, `status.finished`, `status.cancelled`, `status.declined`, `status.expired`), timestamps, settings, documents and download links. Use it to check the state of a request after **Create and Send Signing Request** or a webhook event. Use **List Signing Requests** to find a request ID, and **Download Signed Document** for the signed PDF. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/get-signing-request)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    $.export("$summary", `Retrieved signing request "${response.name || this.signingRequestId}"`);
    return response;
  },
};
