import upbooks from "../../upbooks.app.mjs";

export default {
  key: "upbooks-create-expense-category",
  name: "Create Expense Category",
  description: "Creates a new expense category in UpBooks. [See the documentation](https://www.postman.com/scrrum/workspace/upbooks-io/request/13284127-a07ae2fc-f712-42aa-bcf5-6ce63c7a0929)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    upbooks,
    title: {
      type: "string",
      label: "Title",
      description: "The expense category's title.",
    },
    subCategory: {
      type: "string",
      label: "Sub Category",
      description: "subCategory",
      options: [
        {
          label: "Operating Expense",
          value: "operating-expense",
        },
        {
          label: "Non Operating Expense",
          value: "non-operating-expense",
        },
        {
          label: "Cost Of Goods Sold",
          value: "cost-of-goods-sold",
        },
      ],
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "summary",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      upbooks,
      ...data
    } = this;

    const response = await upbooks.createExpenseCategory({
      $,
      data,
    });
    $.export("$summary", `Successfully created new expense category with Id: ${response.data._id}`);
    return response;
  },
};
