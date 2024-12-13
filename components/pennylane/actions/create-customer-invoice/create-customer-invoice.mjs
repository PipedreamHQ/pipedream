import pennylane from "../../pennylane.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pennylane-create-customer-invoice",
  name: "Create Customer Invoice",
  description: "Generates a new invoice for a customer using Pennylane. [See the documentation](https://pennylane.readme.io/reference/customer_invoices-post-1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pennylane,
    invoiceCustomerId: {
      propDefinition: [
        pennylane,
        "invoiceCustomerId",
      ],
    },
    invoiceItems: {
      propDefinition: [
        pennylane,
        "invoiceItems",
      ],
    },
    paymentTerms: {
      propDefinition: [
        pennylane,
        "paymentTerms",
      ],
    },
    invoiceTaxDetails: {
      propDefinition: [
        pennylane,
        "invoiceTaxDetails",
      ],
      optional: true,
    },
    invoiceFooterCustomization: {
      propDefinition: [
        pennylane,
        "invoiceFooterCustomization",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const invoice = await this.pennylane.generateInvoice();

    $.export("$summary", `Created invoice with ID ${invoice.invoice.id}`);
    return invoice;
  },
};
