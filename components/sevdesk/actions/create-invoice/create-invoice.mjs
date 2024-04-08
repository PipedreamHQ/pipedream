import sevdesk from "../../sevdesk.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sevdesk-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice with optional details like invoice date, due date, discount amount, and invoice items. [See the documentation](https://api.sevdesk.de/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sevdesk,
    contactId: sevdesk.propDefinitions.contactId,
    orderId: sevdesk.propDefinitions.orderId,
    invoiceDate: {
      ...sevdesk.propDefinitions.invoiceDate,
      optional: true,
    },
    dueDate: {
      ...sevdesk.propDefinitions.dueDate,
      optional: true,
    },
    discountAmount: {
      ...sevdesk.propDefinitions.discountAmount,
      optional: true,
    },
    invoiceItems: {
      ...sevdesk.propDefinitions.invoiceItems,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sevdesk.createInvoice({
      contactId: this.contactId,
      orderId: this.orderId,
      invoiceDate: this.invoiceDate,
      dueDate: this.dueDate,
      discountAmount: this.discountAmount,
      invoiceItems: this.invoiceItems
        ? this.invoiceItems.map(JSON.parse)
        : [],
    });

    $.export("$summary", `Successfully created invoice with ID ${response.id}`);
    return response;
  },
};
