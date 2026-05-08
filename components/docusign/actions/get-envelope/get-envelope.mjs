import docusign from "../../docusign.app.mjs";

export default {
  key: "docusign-get-envelope",
  name: "Get Envelope",
  description: "Get details for a DocuSign envelope by ID. Use **List Envelopes** first if you need to find an envelope ID. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/get/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "The DocuSign envelope ID.",
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Optional additional information to include in the response.",
      optional: true,
      options: [
        "custom_fields",
        "documents",
        "extensions",
        "folders",
        "recipients",
        "tabs",
      ],
    },
  },
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });
    const response = await this.docusign.getEnvelope({
      $,
      baseUri,
      envelopeId: this.envelopeId,
      params: {
        include: this.include?.join(","),
      },
    });

    $.export("$summary", `Retrieved envelope ${this.envelopeId}`);
    return response;
  },
};
