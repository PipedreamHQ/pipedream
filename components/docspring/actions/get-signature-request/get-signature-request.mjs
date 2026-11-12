import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-get-signature-request",
  name: "Get Signature Request",
  description: "Get a signature request: who it's for, its `state` (`pending`, `completed` or `declined`), when it was viewed, completed or declined,"
    + " and the values its signer filled in. Use **Get Submission** for the submission and its signed PDF."
    + " [See the documentation](https://docspring.com/docs/api/#tag/signature-requests/get/signature_requests/{signature_request_id})",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docspring,
    signatureRequestId: {
      propDefinition: [
        docspring,
        "signatureRequestId",
      ],
    },
  },
  async run({ $ }) {
    const signatureRequest = await this.docspring.getSignatureRequest({
      $,
      signatureRequestId: this.signatureRequestId,
    });
    $.export("$summary", `Signature request ${signatureRequest.id} is ${signatureRequest.state}`);
    return signatureRequest;
  },
};
