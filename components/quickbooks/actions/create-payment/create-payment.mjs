import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-payment",
  name: "Create Payment",
  description: "Creates a payment. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment#create-a-payment)",
  version: "0.0.1",
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
      label: "Customer Reference Name",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.DisplayName ` from that object for `CustomerRef.name`.",
      type: "string",
      optional: true,
    },
    currencyRefValue: {
      label: "Currency Reference Value",
      description: "A three letter string representing the ISO 4217 code for the currency. For example, `USD`, `AUD`, `EUR`, and so on. This must be defined if multicurrency is enabled for the company.\nMulticurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to `true`. Read more about multicurrency support [here](https://developer.intuit.com/docs?RedirectID=MultCurrencies). Required if multicurrency is enabled for the company.",
      type: "string",
      optional: true,
    },
    currencyRefName: {
      label: "Currency Reference Name",
      description: "The full name of the currency.",
      type: "object",
      optional: true,
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
      $.export("summary", "Successfully created payment");
    }

    return response;
  },
};
