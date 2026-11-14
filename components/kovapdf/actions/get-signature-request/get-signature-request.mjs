import kovapdf from "../../kovapdf.app.mjs";

export default {
  key: "kovapdf-get-signature-request",
  name: "Get Signature Request",
  description: "Get one signature request with its status, signers and audit trail. Use it to check whether everyone has signed before downloading the final PDF with **Download Document**. [See the documentation](https://www.kovapdf.com/developers/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kovapdf,
    signRequestId: {
      propDefinition: [
        kovapdf,
        "signRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kovapdf.getSignatureRequest({
      $,
      signRequestId: this.signRequestId,
    });
    $.export("$summary", `Signature request "${response.title}" is ${response.status}`);
    return response;
  },
};
