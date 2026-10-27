import app from "../../pdfgate.app.mjs";
import { DOCS_URLS } from "../../common/constants.mjs";

export default {
  key: "pdfgate-send-envelope",
  name: "Send Envelope",
  description: `Email the signing links of a draft envelope to its recipients and start the signing process. Use it after **Create Envelope**; the **New Envelope Sent** trigger fires once the envelope is in progress. [See the documentation](${DOCS_URLS.sendEnvelope})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
