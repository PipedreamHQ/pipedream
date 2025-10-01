import app from "../../zoho_expense.app.mjs";

export default {
  key: "zoho_expense-create-expense",
  name: "Create Expense",
  description: "Generate a new expense entry in the Zoho Expense system. [See the Documentation](https://www.zoho.com/expense/api/v1/expenses/#create-an-expense).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    currencyId: {
      propDefinition: [
        app,
        "currencyId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    isReimbursable: {
      type: "boolean",
      label: "Is Reimbursable",
      description: "Whether the expense is reimbursable",
      optional: true,
    },
    numberOfItems: {
      type: "integer",
      label: "How Many Items",
      description: "The number of items to create",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    createExpense(args = {}) {
      return this.app.post({
        path: "/expenses",
        ...args,
      });
    },
    getLineItems() {
      return Array.from({
        length: this.numberOfItems,
      }).reduce((reduction, _, index) => {
        const itemKey = `item${index + 1}`;
        const {
          [`${itemKey}_categoryId`]: categoryId,
          [`${itemKey}_amount`]: amount,
          [`${itemKey}_description`]: description,
        } = this;
        return [
          ...reduction,
          {
            category_id: categoryId,
            amount,
            description,
          },
        ];
      }, []);
    },
  },
  async additionalProps() {
    const {
      organizationId,
      numberOfItems,
    } = this;

    if (!organizationId || !numberOfItems) {
      return {};
    }

    const { expense_accounts: categories = [] } =
      await this.app.listExpenseCategories({
        headers: {
          organizationId,
        },
      });

    const categoryOptions = categories
      .filter(({
        status, is_enabled,
      }) => status === "active" && is_enabled)
      .map(({
        category_id: value, category_name: label,
      }) => ({
        label,
        value,
      }));

    return Array.from({
      length: this.numberOfItems,
    }).reduce((reduction, _, index) => {
      const itemIndex = index + 1;
      const itemKey = `item${itemIndex}`;
      return {
        ...reduction,
        [`${itemKey}_categoryId`]: {
          type: "string",
          label: `Item ${itemIndex} - Category ID`,
          description: `The ID of the category for item ${itemIndex}`,
          options: categoryOptions,
        },
        [`${itemKey}_amount`]: {
          type: "string",
          label: `Item ${itemIndex} - Amount`,
          description: `The amount of the item ${itemIndex}`,
        },
        [`${itemKey}_description`]: {
          type: "string",
          label: `Item ${itemIndex} - Description`,
          description: `The description of the item ${itemIndex}`,
          optional: true,
        },
      };
    }, {});
  },
  async run({ $: step }) {
    const {
      organizationId, currencyId, isReimbursable,
    } = this;

    const response = await this.createExpense({
      step,
      headers: {
        organizationId,
      },
      data: {
        currency_id: currencyId,
        is_reimbursable: isReimbursable,
        line_items: this.getLineItems(),
      },
    });

    step.export("$summary", `Successfully created expense with ID ${response.expenses[0]?.expense_id}`);

    return response;
  },
};
