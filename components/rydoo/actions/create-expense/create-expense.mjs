import { parseObject } from "../../common/utils.mjs";
import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-create-expense",
  name: "Create Expense",
  description: "Adds a new expense entry for a user. [See the documentation](https://developers.rydoo.com/reference/v3expensesaddexpense)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rydoo,
    userId: {
      propDefinition: [
        rydoo,
        "userId",
      ],
    },
    amount: {
      propDefinition: [
        rydoo,
        "amount",
      ],
    },
    currencyCode: {
      propDefinition: [
        rydoo,
        "currencyCode",
      ],
    },
    expenseDate: {
      propDefinition: [
        rydoo,
        "expenseDate",
      ],
    },
    categoryId: {
      propDefinition: [
        rydoo,
        "categoryId",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        rydoo,
        "groupId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        rydoo,
        "projectId",
      ],
      optional: true,
    },
    tripId: {
      propDefinition: [
        rydoo,
        "tripId",
      ],
      optional: true,
    },
    merchantName: {
      propDefinition: [
        rydoo,
        "merchantName",
      ],
      optional: true,
    },
    countryCode: {
      propDefinition: [
        rydoo,
        "countryCode",
      ],
      optional: true,
    },
    comment: {
      propDefinition: [
        rydoo,
        "comment",
      ],
      optional: true,
    },
    customFieldValues: {
      propDefinition: [
        rydoo,
        "customFieldValues",
      ],
      optional: true,
    },
    customExchangeRates: {
      propDefinition: [
        rydoo,
        "customExchangeRates",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.createExpense({
      $,
      data: {
        userId: this.userId,
        amount: this.amount !== undefined && this.amount !== null
          ? Number(this.amount)
          : undefined,
        currencyCode: this.currencyCode,
        expenseDate: this.expenseDate,
        groupId: this.groupId,
        categoryId: this.categoryId,
        projectId: this.projectId,
        countryCode: this.countryCode,
        merchantName: this.merchantName,
        comment: this.comment,
        tripId: this.tripId,
        customFieldValues: this.customFieldValues
          ? parseObject(this.customFieldValues)
          : undefined,
        customExchangeRates: this.customExchangeRates
          ? parseObject(this.customExchangeRates)
          : undefined,
      },
    });

    $.export("$summary", `Successfully created expense with ID: ${response.expenseId}`);
    return response;
  },
};
