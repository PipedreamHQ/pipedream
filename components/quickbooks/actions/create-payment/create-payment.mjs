import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-payment",
  name: "Create Payment",
  description: "Creates a payment. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment#create-a-payment)",
  version: "0.0.3",
  type: "action",
  props: {
    quickbooks,
    totalAmount: {
      label: "Total Amount",
      description: "Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. E.g. 25.0",
      type: "string",
    },
    customerRefValue: {
      label: "Customer Reference Value",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` from that object for `CustomerRef.value`.",
      type: "string",
    },
    customerRefName: {
      propDefinition: [
        quickbooks,
        "customerRefName",
      ],
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currencyRefValue",
      ],
    },
    currencyRefName: {
      propDefinition: [
        quickbooks,
        "currencyRefName",
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
          name: this.customerRefName,
        },
        CurrencyRef: {
          value: this.currencyRefValue,
          name: this.currencyRefName,
        },
      },
    });

    if (response) {
      $.export("summary", `Successfully created payment with id ${response.Payment.Id}`);
    }

    return response;
  },
};
