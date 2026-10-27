import app from "../../pdfgate.app.mjs";
import { DOCS_URL } from "../../common/constants.mjs";

export default {
  key: "pdfgate-get-envelope",
  name: "Get Envelope",
  description: `Retrieve a PDFGate envelope by ID, including its documents and recipient statuses. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
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
