import paytrace from "../../paytrace.app.mjs";
import common from "../../common/common.mjs";

export default {
  name: "List Transactions",
  description: "This method can be used to export a set of credit card transaction details with a provided date range. You can optimize your search by providing optional parameters. [See docs here](https://developers.paytrace.com/support/home#14000045877)",
  key: "paytrace-list-transactions",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      options: common.transactionTypes,
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
        start_date: this.startDate,
        end_date: this.endDate,
        transaction_id: this.transactionId,
        transaction_type: this.transactionType,
        customer_id: this.customerId,
        include_bin: this.includeBin,
        including_text: this.includingText,
      },
    });
    $.export("$summary", `${response.transactions} transactions has been retrieved`);
    return response;
  },
};
