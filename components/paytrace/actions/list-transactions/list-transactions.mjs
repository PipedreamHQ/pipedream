import paytrace from "../../paytrace.app.mjs";

export default {
  name: "List Transactions",
  description: "This method can be used to export a set of credit card transaction details with a provided date range.  You can optimize your search by providing optional parameters.",
  key: "paytrace-list-transactions",
  version: "0.0.1",
  type: "action",
  props: {
    paytrace,
    startDate: {
      propDefinition: [
        paytrace,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        paytrace,
        "endDate",
      ],
    },
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "A unique identifier for each transaction in the PayTrace system.",
      optional: true,
    },
    transactionType: {
      type: "string",
      label: "Transaction Type",
      description: "The transaction type to find transactions.",
      optional: true,
      options: [
        "SALE",
        "AUTHORIZATION",
        "STR/FWD",
        "REFUND",
        "VOID",
        "SETTLED",
        "PENDING",
        "DECLINED",
      ],
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "A unique identifier for an existing customer profile stored in your Customer Database (Vault) at PayTrace.",
      optional: true,
    },
    includeBin: {
      type: "boolean",
      label: "Include BIN",
      description: "If set to true, this will return the first 6 and last 4 digits of the card number.",
      optional: true,
    },
    includingText: {
      type: "string",
      label: "Search Text",
      description: "The text submitted will be used to locate transactions containing this text. This will help to narrow down the export results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paytrace.listTransactions({
      $,
      data: {
        startDate: this.startDate,
        endDate: this.endDate,
        transactionId: this.transactionId,
        transactionType: this.transactionType,
        customerId: this.customerId,
        includeBin: this.includeBin,
        includingText: this.includingText,
      },
    });
    $.export("$summary", `${response.transactions} transactions has been retrieved`);
    return response;
  },
};
