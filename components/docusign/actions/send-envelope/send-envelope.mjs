import docusign from "../../docusign.app.mjs";

export default {
  key: "docusign-send-envelope",
  name: "Send Envelope",
  description: "Send an existing draft DocuSign envelope by updating its status to `sent`. Use this after **Create Envelope** or **Create Envelope From File**, or any workflow that creates an envelope with status `created`. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/update/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      propDefinition: [
        docusign,
        "envelopeId",
        (c) => ({
          account: c.account,
        }),
      ],
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
        status: "sent",
      },
    });

    $.export("$summary", `Sent envelope ${this.envelopeId}`);
    return response;
  },
};
