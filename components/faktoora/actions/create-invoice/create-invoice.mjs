import faktoora from "../../faktoora.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "faktoora-create-invoice",
  name: "Create Invoice",
  description: "Create a new ZUGFeRD/xrechnung invoice. [See the documentation](https://api.faktoora.com/api/v1/api-docs/static/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    faktoora,
    format: faktoora.propDefinitions.format,
    invoiceNumber: faktoora.propDefinitions.invoiceNumber,
    issueDate: faktoora.propDefinitions.issueDate,
    currency: faktoora.propDefinitions.currency,
    buyerName: faktoora.propDefinitions.buyerName,
    sellerName: faktoora.propDefinitions.sellerName,
    totalAmount: faktoora.propDefinitions.totalAmount,
    taxAmount: faktoora.propDefinitions.taxAmount,
  },
  async run({ $ }) {
    const response = await this.faktoora.createInvoice({
      format: this.format,
      invoiceNumber: this.invoiceNumber,
      issueDate: this.issueDate,
      currency: this.currency,
      buyerName: this.buyerName,
      sellerName: this.sellerName,
      totalAmount: this.totalAmount,
      taxAmount: this.taxAmount,
    });

    $.export("$summary", `Successfully created invoice with number ${this.invoiceNumber}`);
    return response;
  },
};
