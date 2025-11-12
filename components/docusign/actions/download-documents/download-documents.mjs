import docusign from "../../docusign.app.mjs";
import fs from "fs";

export default {
  key: "docusign-download-documents",
  name: "Download Documents",
  description: "Download the documents of an envelope to the /tmp directory. [See the documentation here](https://developers.docusign.com/docs/esign-rest-api/how-to/download-envelope-documents/)",
  version: "0.0.4",
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
      type: "string",
      label: "Envelope ID",
      description: "Identifier of the envelope to download documents from",
      async options({ prevContext }) {
        const baseUri = await this.docusign.getBaseUri({
          accountId: this.account,
        });
        const { startPosition } = prevContext;
        const {
          envelopes = [], nextUri, endPosition,
        } = await this.docusign.listEnvelopes(baseUri, {
          start_position: startPosition,
          from_date: "2000-01-01",
        });
        return {
          options: envelopes.map(({
            envelopeId: value, emailSubject: label,
          }) => ({
            label,
            value,
          })),
          context: {
            startPosition: nextUri
              ? endPosition + 1
              : undefined,
          },
        };
      },
    },
    downloadType: {
      type: "string",
      label: "Download Type",
      description: "Download envelope documents to the `/tmp` directory",
      options: [
        {
          label: "All Documents (PDF)",
          value: "combined",
        },
        {
          label: "All Documents (Zip)",
          value: "archive",
        },
        {
          label: "Certificate (PDF)",
          value: "certificate",
        },
        {
          label: "Portfolio (PDF)",
          value: "portfolio",
        },
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the file as in the `/tmp` directory including the file extension (.pdf or .zip)",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    getEnvelope($, baseUri, envelopeId) {
      return this.docusign._makeRequest({
        $,
        config: {
          url: `${baseUri}envelopes/${envelopeId}`,
        },
      });
    },
    async downloadToTmp($, baseUri, documentsUri, filePath) {
      const content = await this.docusign._makeRequest({
        $,
        config: {
          url: `${baseUri}${documentsUri.slice(1)}/${this.downloadType}`,
          responseType: "arraybuffer",
        },
      });
      const rawcontent = content.toString("base64");
      const buffer = Buffer.from(rawcontent, "base64");
      fs.writeFileSync(filePath, buffer);
    },
  },
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      accountId: this.account,
    });
    const envelope = await this.getEnvelope($, baseUri, this.envelopeId);
    const filePath = `/tmp/${this.filename}`;
    await this.downloadToTmp($, baseUri, envelope.documentsUri, filePath);

    $.export("$summary", `Successfully downloaded files to ${filePath}`);

    return filePath;
  },
};
