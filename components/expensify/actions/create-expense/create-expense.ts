import { defineAction } from "@pipedream/types";
import expensify from "../../app/expensify.app";

export default defineAction({
  key: "expensify-create-expense",
  version: "0.0.4",
  name: "Create Expense",
  description: "Creates a new expense. [See docs here](https://integrations.expensify.com/Integration-Server/doc/#expense-creator)",
  type: "action",
  props: {
    expensify,
    employeeEmail: {
      propDefinition: [
        expensify,
        "employeeEmail",
      ],
    },
    currency: {
      label: "Currency",
      description: "The three-letter currency code of the expense. E.g. `USD`",
      type: "string",
    },
    amount: {
      label: "Amount",
      description: "The amount of the expense, in cents. E.g. `2215` will be `$22.15`",
      type: "integer",
    },
    merchant: {
      label: "Merchant",
      description: "The name of the expense's merchant",
      type: "string",
    },
    created: {
      label: "Created Date",
      description: "The date of the expense (format yyyy-mm-dd). E.g. 2022-07-12",
      type: "string",
    },
    comment: {
      label: "Comment",
      description: "An expense comment",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.expensify.createExpense({
      $,
      data: {
        employeeEmail: this.employeeEmail,
        transactionList: [
          {
            created: this.created,
            comment: this.comment,
            currency: this.currency,
            amount: this.amount,
            merchant: this.merchant,
          },
        ],
      },
    });

    if (response.responseCode >= 200 && response.responseCode < 300) {
      $.export("$summary", `Successfully created expense with id ${response.id}`);
    }

    return response;
  },
});
