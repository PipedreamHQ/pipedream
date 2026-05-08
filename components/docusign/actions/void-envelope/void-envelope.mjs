import docusign from "../../docusign.app.mjs";

export default {
  key: "docusign-void-envelope",
  name: "Void Envelope",
  description: "Void a DocuSign envelope that is still in process. Voiding cancels the envelope and prevents recipients from completing it. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/update/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    docusign,
    account: {
      propDefinition: [
        docusign,
        "account",
      ],
    },
    envelopeId: {
      type: "string",
      label: "Envelope ID",
      description: "The envelope ID to void.",
    },
    voidedReason: {
      type: "string",
      label: "Voided Reason",
      description: "Reason the envelope is being voided. This is visible in DocuSign audit history.",
    },
  },
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });
    const response = await this.docusign.updateEnvelope({
      $,
      baseUri,
      envelopeId: this.envelopeId,
      data: {
        status: "voided",
        voidedReason: this.voidedReason,
      },
    });

    $.export("$summary", `Voided envelope ${this.envelopeId}`);
    return response;
  },
};
