import finmei from "../../finmei.app.mjs";

export default {
  key: "finmei-create-invoice",
  name: "Create Invoice",
  description: "Generates a new invoice within Finmei. [See the documentation](https://api.finmei.com/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    finmei,
    customerId: {
      propDefinition: [
        finmei,
        "customerId",
      ],
    },
    billingAddress: {
      propDefinition: [
        finmei,
        "billingAddress",
      ],
    },
    transactionDetails: {
      propDefinition: [
        finmei,
        "transactionDetails",
      ],
    },
    dueDate: {
      propDefinition: [
        finmei,
        "dueDate",
      ],
    },
    notes: {
      propDefinition: [
        finmei,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.finmei.createInvoice({
      customerId: this.customerId,
      billingAddress: this.billingAddress,
      transactionDetails: this.transactionDetails,
      dueDate: this.dueDate,
      notes: this.notes,
    });
    $.export("$summary", `Successfully created invoice for customer ID ${this.customerId}`);
    return response;
  },
};
