import app from "../../deel.app.mjs";

export default {
  key: "deel-get-contract-preview",
  name: "Get Contract Preview",
  description:
    "Retrieve the full contract agreement text as HTML for a specific Deel contract."
    + " Use this when the user wants to read, review, or summarize the actual contract document."
    + " Works for IC and EOR contracts."
    + " Use **List Contracts** to find contract IDs."
    + " [See the documentation](https://developer.deel.com/api/reference/endpoints/contracts/get-contract)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getContractPreview($, this.contractId);

    // Contract HTML can be very large — truncate to avoid token limits
    const MAX_CHARS = 12000;
    if (typeof response === "string" && response.length > MAX_CHARS) {
      const truncated = response.substring(0, MAX_CHARS);
      $.export("$summary", `Retrieved contract preview for contract ${this.contractId} (truncated to ${MAX_CHARS} chars)`);
      return {
        preview: truncated,
        truncated: true,
        original_length: response.length,
        note: `Preview truncated from ${response.length} to ${MAX_CHARS} characters to fit context limits.`,
      };
    }

    $.export("$summary", `Retrieved contract preview for contract ${this.contractId}`);
    return response;
  },
};
