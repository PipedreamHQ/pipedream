import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-create-signing-link",
  name: "Create Signing Link",
  description: "Create a new signing link for a signature request, to send or open again after an earlier link expired."
    + " Returns the token: `signature_request_url` is the link, and `expires_at` is when it stops opening the form."
    + " A form that opened in time keeps working for 7 more days."
    + " Use **Create Signature Request** or **Get Submission** to find the signature request's ID."
    + " [See the documentation](https://docspring.com/docs/api/#tag/signature-requests/post/signature_requests/{signature_request_id}/tokens)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    signatureRequestId: {
      propDefinition: [
        docspring,
        "signatureRequestId",
      ],
    },
    signingLinkType: {
      propDefinition: [
        docspring,
        "signingLinkType",
      ],
    },
  },
  async run({ $ }) {
    const token = await this.docspring.createSignatureRequestToken({
      $,
      signatureRequestId: this.signatureRequestId,
      data: {
        type: this.signingLinkType || "email",
      },
    });
    $.export("$summary", `Created a signing link for signature request ${this.signatureRequestId}, expiring ${token.expires_at}`);
    return token;
  },
};
