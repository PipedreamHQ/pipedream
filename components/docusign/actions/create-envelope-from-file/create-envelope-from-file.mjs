import docusign from "../../docusign.app.mjs";
import {
  ENVELOPE_CREATION_STATUS_OPTIONS,
  getFileExtension,
  parseOptionalJsonObject,
  streamToBase64,
} from "../common/utils.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "docusign-create-envelope-from-file",
  name: "Create Envelope From File",
  description: "Create and optionally send a single-document DocuSign envelope from a file path or URL. This action places a SignHere tab by anchor text, such as `/sn1/`, in the uploaded document. Set Client User ID when you need embedded signing, then use **Create Recipient View** with the same value. [See the documentation](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/create/)",
  version: "0.0.3",
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
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The document to send. Provide either a file URL or a path to a file in `/tmp`, for example `/tmp/contract.pdf`.",
      format: "file-ref",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
    emailSubject: {
      propDefinition: [
        docusign,
        "emailSubject",
      ],
    },
    signerName: {
      propDefinition: [
        docusign,
        "recipientName",
      ],
      label: "Signer Name",
    },
    signerEmail: {
      propDefinition: [
        docusign,
        "recipientEmail",
      ],
      label: "Signer Email",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Use `sent` to send immediately or `created` to save as a draft.",
      options: ENVELOPE_CREATION_STATUS_OPTIONS,
      default: "sent",
    },
    documentName: {
      type: "string",
      label: "Document Name",
      description: "Optional document name shown in DocuSign. Defaults to the uploaded file name.",
      optional: true,
    },
    fileExtension: {
      type: "string",
      label: "File Extension",
      description: "Optional file extension. Defaults to the uploaded file extension, or `pdf` if one cannot be detected.",
      optional: true,
    },
    signerRecipientId: {
      type: "string",
      label: "Signer Recipient ID",
      description: "Recipient ID to assign to the new signer in this envelope.",
      optional: true,
      default: "1",
    },
    routingOrder: {
      type: "string",
      label: "Routing Order",
      description: "Routing order for the signer.",
      optional: true,
      default: "1",
    },
    clientUserId: {
      type: "string",
      label: "Client User ID",
      description: "Set this for embedded signing recipients. The same value is required when creating a recipient view URL.",
      optional: true,
    },
    signHereAnchorString: {
      type: "string",
      label: "Sign Here Anchor String",
      description: "Text in the document where DocuSign should place the signature tab. The text is not shown to signers. Example: `/sn1/`.",
      default: "/sn1/",
    },
    anchorXOffset: {
      type: "string",
      label: "Anchor X Offset",
      description: "Horizontal offset in pixels for the signature tab relative to the anchor text.",
      optional: true,
      default: "20",
    },
    anchorYOffset: {
      type: "string",
      label: "Anchor Y Offset",
      description: "Vertical offset in pixels for the signature tab relative to the anchor text.",
      optional: true,
      default: "10",
    },
    signerOverridesJson: {
      type: "string",
      label: "Signer Overrides JSON",
      description: "Optional JSON object merged into the signer object using `...signerOverrides` for advanced recipient settings. Example: `{\"note\":\"Please sign by Friday\"}`. If `signerOverridesJson` includes a `tabs` key, it overwrites the generated `signHereTabs` from `signHereAnchorString`; omit `tabs` or include `signHereTabs` in the override to preserve anchor signing.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    const documentBase64 = await streamToBase64(stream);
    const filename = metadata.name || this.filePath;
    const signerOverrides = parseOptionalJsonObject(
      this.signerOverridesJson,
      "Signer Overrides JSON",
    );

    const signer = {
      email: this.signerEmail,
      name: this.signerName,
      recipientId: this.signerRecipientId,
      routingOrder: this.routingOrder,
      clientUserId: this.clientUserId,
      tabs: {
        signHereTabs: [
          {
            anchorString: this.signHereAnchorString,
            anchorUnits: "pixels",
            anchorXOffset: this.anchorXOffset,
            anchorYOffset: this.anchorYOffset,
          },
        ],
      },
      ...signerOverrides,
    };

    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });
    const response = await this.docusign.createEnvelope({
      $,
      baseUri,
      data: {
        emailSubject: this.emailSubject,
        status: this.status,
        documents: [
          {
            documentBase64,
            name: this.documentName || filename,
            fileExtension: this.fileExtension || getFileExtension(filename),
            documentId: "1",
          },
        ],
        recipients: {
          signers: [
            signer,
          ],
        },
      },
    });

    $.export("$summary", response.envelopeId
      ? `Created envelope ${response.envelopeId} from ${filename}`
      : `Created envelope from ${filename}`);
    return response;
  },
};
