// legacy_hash_id: a_k6irBN
import fs from "fs";
import axios from "axios";

export default {
  key: "xero_accounting_api-download-invoice",
  name: "Download Invoice",
  description: "Downloads an invoice as pdf file. File will be placed at the action's associated workflow temporary folder.",
  version: "0.1.2",
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
    invoice_id: {
      type: "string",
      description: "Xero generated unique identifier for the invoice to download.",
    },
  },
  async run({ $ }) {
    //See the API docs: https://developer.xero.com/documentation/api/invoices#get and https://developer.xero.com/documentation/api/requests-and-responses#get-individual
    //For an example of this action in an workflow, see: https://pipedream.com/@sergio/xero-accounting-api-download-invoice-p_vQCgy3o/edit

    if (!this.tenant_id || !this.invoice_id) {
      throw new Error("Must provide tenant_id, invoice_id parameters.");
    }

    const resp = await axios({
      url: `https://api.xero.com/api.xro/2.0/Invoices/${this.invoice_id}`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "Accept": "application/pdf",
        "xero-tenant-id": this.tenant_id,
      },
      responseType: "arraybuffer",
    });

    const invoicePdf = resp.data.toString("base64");
    const buffer = Buffer.from(invoicePdf, "base64");
    const tmpDir = "/tmp";
    const invoicePath = `${tmpDir}/${this.invoice_id}.pdf`;
    $.export("invoice_path", invoicePath); //This is where the invoice is saved at the workflow's temporary files.
    fs.writeFileSync(invoicePath, buffer);
    console.log(`Invoice saved at: ${invoicePath}`);
  },
};
