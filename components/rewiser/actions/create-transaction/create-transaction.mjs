import { getSummary } from "../../common/utils.mjs";
import rewiser from "../../rewiser.app.mjs";

export default {
  key: "rewiser-create-transaction",
  name: "Create Transaction",
  description: "Create a financial transaction in Rewiser. [See the documentation](https://rewiser.io/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rewiser,
    folderId: {
      propDefinition: [
        rewiser,
        "folderId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of transaction.",
      options: [
        {
          label: "Income",
          value: "income",
        },
        {
          label: "Expense",
          value: "expense",
        },
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name/description of the transaction.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount of the transaction.",
    },
    plannedDate: {
      type: "string",
      label: "Planned Date",
      description: "The planned date for the transaction, in the format `YYYY-MM-DD` (e.g. `2025-01-01`)",
    },
    isPaid: {
      type: "boolean",
      label: "Is Paid",
      description: "Whether the transaction is paid.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional notes for the transaction.",
      optional: true,
    },
    repeatType: {
      type: "string",
      label: "Repeat Type",
      description: "The repeat type for recurring transactions.",
      options: [
        {
          label: "Daily",
          value: "daily",
        },
        {
          label: "Weekly",
          value: "weekly",
        },
        {
          label: "Monthly",
          value: "monthly",
        },
        {
          label: "Yearly",
          value: "yearly",
        },
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rewiser.createTransaction({
      $,
      data: {
        transactions: [
          {
            folder_id: this.folderId,
            type: this.type,
            name: this.name,
            amount: parseFloat(this.amount),
            planned_date: this.plannedDate,
            is_paid: this.isPaid,
            note: this.note,
            repeat_type: this.repeatType,
          },
        ],
      },
    });

    $.export("$summary", getSummary(response));
    return response;
  },
};
