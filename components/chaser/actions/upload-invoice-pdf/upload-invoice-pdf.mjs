import chaser from "../../chaser.app.mjs";

export default {
  key: "chaser-upload-invoice-pdf",
  name: "Upload Invoice PDF",
  description: "Uploads a new invoice in PDF format to Chaser. [See the documentation](https://openapi.chaserhq.com/docs/static/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    chaser,
    invoicePdfFile: chaser.propDefinitions.invoicePdfFile,
    customerDetails: {
      ...chaser.propDefinitions.customerDetails,
      optional: true,
    },
  },
  async run({ $ }) {
    let customerResponse = {};

    if (this.customerDetails) {
      customerResponse = await this.chaser.createCustomer({
        customerDetails: this.customerDetails,
      });
    }

    const response = await this.chaser.uploadInvoicePdf({
      invoicePdfFile: this.invoicePdfFile,
      customerDetails: this.customerDetails
        ? {
          customer_id: customerResponse.id,
        }
        : {},
    });

    $.export("$summary", "Successfully uploaded invoice PDF to Chaser");
    return response;
  },
};
