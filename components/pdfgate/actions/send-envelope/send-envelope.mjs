import app from "../../pdfgate.app.mjs";
import { DOCS_URL } from "../../common/constants.mjs";

export default {
  key: "pdfgate-send-envelope",
  name: "Send Envelope",
  description: `Send a signing envelope to its recipients. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.app.sendEnvelope({
      $,
      envelopeId: this.envelopeId,
    });
    $.export("$summary", `Successfully sent envelope ${this.envelopeId}`);
    return response;
  },
};
