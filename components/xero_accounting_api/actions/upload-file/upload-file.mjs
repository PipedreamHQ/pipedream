import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
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
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePathOrUrl);
    const data = new FormData();
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.xeroAccountingApi.uploadFile({
      $,
      tenantId: this.tenantId,
      documentType: this.documentType,
      documentId: this.documentId,
      fileName: metadata.name,
      headers: {
        ...data.getHeaders(),
      },
      data,
    });

    $.export("$summary", `Successfully uploaded file to ${this.documentType} with ID: ${this.documentId}`);
    return response;
  },
};
