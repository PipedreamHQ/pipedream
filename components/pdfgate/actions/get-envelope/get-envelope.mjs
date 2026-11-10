import app from "../../pdfgate.app.mjs";
import { DOCS_URLS } from "../../common/constants.mjs";

export default {
  key: "pdfgate-get-envelope",
  name: "Get Envelope",
  description: `Retrieve an envelope by ID with its status, documents, recipients and their signing status, and the signed and audit-log document IDs once completed. Use it to check progress after **Send Envelope** or to fetch results on demand. [See the documentation](${DOCS_URLS.getEnvelope})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    envelopeId: {
      propDefinition: [
        app,
        "envelopeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getEnvelope({
      $,
      envelopeId: this.envelopeId,
    });
    $.export("$summary", `Successfully retrieved envelope ${this.envelopeId}`);
    return response;
  },
};
