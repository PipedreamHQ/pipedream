import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-payment",
  name: "Create Payment",
  description: "Creates a payment. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment#create-a-payment)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    totalAmount: {
      label: "Total Amount",
      description: "Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. E.g. 25.0",
      type: "string",
    },
    customerRefValue: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.quickbooks.createPayment({
      $,
      data: {
        TotalAmt: this.totalAmount,
        CustomerRef: {
          value: this.customerRefValue,
        },
        CurrencyRef: {
          value: this.currencyRefValue,
        },
      },
    });

    if (response) {
      $.export("summary", `Successfully created payment with ID ${response.Payment.Id}`);
    }

    return response;
  },
};
