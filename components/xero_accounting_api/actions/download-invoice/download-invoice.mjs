import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-download-invoice",
  name: "Download Invoice",
  description: "Downloads an invoice as pdf file. File will be placed at the action's associated workflow temporary folder.",
  version: "0.2.2",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    invoiceId: {
      label: "Invoice ID",
      type: "string",
      description: "Xero generated unique identifier for the invoice to download.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.invoiceId) {
      throw new ConfigurationError("Must provide **Tenant ID**, and **Invoice ID** parameters.");
    }

    const data = await this.xeroAccountingApi.downloadInvoice({
      $,
      tenantId: this.tenantId,
      invoiceId: this.invoiceId,
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });

    const invoicePdf = data.toString("base64");
    const buffer = Buffer.from(invoicePdf, "base64");
    const tmpDir = "/tmp";
    const invoicePath = `${tmpDir}/${this.invoiceId}.pdf`;
    $.export("invoice_path", invoicePath); //This is where the invoice is saved at the workflow's temporary files.
    fs.writeFileSync(invoicePath, buffer);
    console.log(`Invoice saved at: ${invoicePath}`);
    return {
      filePath: invoicePath,
    };
  },
};
