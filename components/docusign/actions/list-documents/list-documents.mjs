import docusign from "../../docusign.app.mjs";

export default {
  key: "docusign-list-documents",
  name: "List Documents",
  description: "List documents in a DocuSign envelope. Use this to find document IDs before downloading a specific document. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopedocuments/list/)",
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
      propDefinition: [
        docusign,
        "envelopeId",
        (c) => ({
          account: c.account,
        }),
      ],
    },
    includeTabs: {
      type: "boolean",
      label: "Include Tabs",
      description: "Whether to include tab information for each document.",
      optional: true,
      default: false,
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Whether to include document metadata.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });
    const response = await this.docusign.listEnvelopeDocuments({
      $,
      baseUri,
      envelopeId: this.envelopeId,
      params: {
        include_tabs: this.includeTabs,
        include_metadata: this.includeMetadata,
      },
    });
    const documents = response?.envelopeDocuments ?? [];

    $.export("$summary", `Retrieved ${documents.length} documents`);
    return response;
  },
};
