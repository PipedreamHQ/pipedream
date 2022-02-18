// legacy_hash_id: a_B0i8rE
import fs from "fs";
import FormData from "form-data";
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-upload-file",
  name: "Upload File",
  description: "Uploads a file to the specified document.",
  version: "0.2.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    attachment_filename: {
      type: "string",
      description: "Name of the file to upload as an attachment to the Xero document.",
    },
    document_type: {
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
    document_id: {
      type: "string",
      description: "Xero identifier of the document where the attachment will be sent to.",
    },
  },
  async run({ $ }) {
    //See the API docs: https://developer.xero.com/documentation/api/invoices#upload-attachment
    //See a workflow example of this action: https://pipedream.com/@sergio/xero-accounting-api-upload-file-p_rvCqADQ/edit

    if (!this.tenant_id) {
      throw new Error("Must provide tenant_id parameter.");
    }

    let data = new FormData();
    const file = fs.createReadStream(`/tmp/${this.attachment_filename}`);
    data.append("file", file);

    //Sends the request against Xero Accounting API
    return await axios($, {
      method: "post",
      url: `https://api.xero.com/api.xro/2.0/${this.document_type}/${this.document_id}/Attachments/${attachment_filename}`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      data,
    });
  },
};
