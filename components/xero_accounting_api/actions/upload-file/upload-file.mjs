import { getFileStreamAndMetadata } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-upload-file",
  name: "Upload File",
  description: "Uploads a file to the specified document. [See the documentation](https://developer.xero.com/documentation/api/accounting/invoices#upload-attachment)",
  version: "1.0.2",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    filePathOrUrl: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    documentType: {
      label: "Document Type",
      type: "string",
      description: "Document type of where the attachment will be sent to. This is used in as part of the Xero Account API endpoint where the request is sent against.",
      options: [
        "Accounts",
        "BankTransactions",
        "Contacts",
        "CreditNotes",
        "Invoices",
        "ManualJournals",
        "PurchaseOrders",
        "Receipts",
        "RepeatingInvoices",
      ],
    },
    documentId: {
      label: "Document ID",
      type: "string",
      description: "Xero identifier of the document where the attachment will be sent to.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePathOrUrl);
    const fileBinary = await this.streamToBuffer(stream);

    const response = await this.xeroAccountingApi.uploadFile({
      $,
      tenantId: this.tenantId,
      documentType: this.documentType,
      documentId: this.documentId,
      fileName: metadata.name,
      headers: {
        "Content-Type": metadata.contentType,
        "Content-Length": metadata.size,
        "Accept": "application/json",
      },
      data: Buffer.from(fileBinary, "binary"),
    });

    $.export("$summary", `Successfully uploaded file to ${this.documentType} with ID: ${this.documentId}`);
    return response;
  },
};
