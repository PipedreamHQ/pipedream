import docusign from "../../docusign.app.mjs";

export default {
  key: "docusign-list-recipients",
  name: "List Recipients",
  description: "List recipients and recipient status for a DocuSign envelope. Use Include Tabs when you need each recipient's tab values and placement. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/enveloperecipients/list/)",
  version: "0.0.2",
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
      description: "Whether to include each recipient's tabs.",
      optional: true,
      default: false,
    },
    includeExtended: {
      type: "boolean",
      label: "Include Extended",
      description: "Whether to include extended recipient information.",
      optional: true,
      default: false,
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Whether to include metadata.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });
    const response = await this.docusign.listRecipients({
      $,
      baseUri,
      envelopeId: this.envelopeId,
      params: {
        include_tabs: this.includeTabs,
        include_extended: this.includeExtended,
        include_metadata: this.includeMetadata,
      },
    });
    const recipients = Object.values(response)
      .filter(Array.isArray)
      .reduce((count, value) => count + value.length, 0);

    $.export("$summary", `Retrieved ${recipients} recipients`);
    return response;
  },
};
