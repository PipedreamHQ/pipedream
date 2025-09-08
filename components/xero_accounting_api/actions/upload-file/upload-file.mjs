// legacy_hash_id: a_B0i8rE
import FormData from "form-data";
import {
  axios, getFileStreamAndMetadata,
} from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-upload-file",
  name: "Upload File",
  description: "Uploads a file to the specified document. [See the documentation](https://developer.xero.com/documentation/api/accounting/invoices#upload-attachment)",
  version: "1.0.1",
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

    //Sends the request against Xero Accounting API
    return await axios($, {
      method: "post",
      url: `https://api.xero.com/api.xro/2.0/${this.documentType}/${this.documentId}/Attachments/${metadata.name}`,
      headers: {
        "Authorization": `Bearer ${this.xeroAccountingApi.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenantId,
        ...data.getHeaders(),
      },
      data,
    });
  },
};
