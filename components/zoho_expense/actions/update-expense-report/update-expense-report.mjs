import app from "../../zoho_expense.app.mjs";

export default {
  key: "zoho_expense-update-expense-report",
  name: "Update Expense Report",
  description: "Alter details in an existing expense report. [See the Documentation](https://www.zoho.com/expense/api/v1/expense-reports/#update-an-expense-report).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    reportName: {
      type: "string",
      label: "Report Name",
      description: "The name of the report",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the report. Eg: `2019-12-01`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the report. Eg: `2019-12-31`",
      optional: true,
    },
    numberOfExpenses: {
      type: "integer",
      label: "How Many Expenses",
      description: "The number of expenses to update in the report",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    updateExpenseReport(args = {}) {
      return this.app.put({
        path: "/expensereports/",
        ...args,
      });
    },
    getExpenses() {
      return Array.from({
        length: this.numberOfExpenses,
      }).reduce((reduction, _, index) => {
        const expenseKey = `expense${index + 1}`;
        const {
          [`${expenseKey}_expenseId`]: expenseId,
          [`${expenseKey}_order`]: order,
        } = this;
        return [
          ...reduction,
          {
            expense_id: expenseId,
            order,
          },
        ];
      }, []);
    },
  },
  async additionalProps() {
    const {
      organizationId,
      numberOfExpenses,
    } = this;

    if (!organizationId || !numberOfExpenses) {
      return {};
    }

    const { expenses } = await this.app.listExpenses({
      headers: {
        organizationId,
      },
    });

    const expenseOptions = expenses.map(({
      expense_id: value, description: label,
    }) => ({
      label,
      value,
    }));

    return Array.from({
      length: this.numberOfExpenses,
    }).reduce((reduction, _, index) => {
      const expenseIndex = index + 1;
      const expenseKey = `expense${expenseIndex}`;
      return {
        ...reduction,
        [`${expenseKey}_expenseId`]: {
          type: "string",
          label: `Expense ${expenseIndex} - Expense ID`,
          description: "The ID of the expense",
          options: expenseOptions,
        },
        [`${expenseKey}_order`]: {
          type: "integer",
          label: `Expense ${expenseIndex} - Order`,
          description: "The order of the expense in the report.",
        },
      };
    }, {});
  },
  async run({ $: step }) {
    const {
      organizationId,
      reportName,
      startDate,
      endDate,
    } = this;

    const response = await this.updateExpenseReport({
      step,
      headers: {
        organizationId,
      },
      data: {
        report_name: reportName,
        start_date: startDate,
        end_date: endDate,
        expenses: this.getExpenses(),
      },
    });

    step.export("$sumamry", `Successfully updated expense report with ID ${response.expense_report.report_id}`);

    return response;
  },
};
