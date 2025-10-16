import { defineAction } from "@pipedream/types";
import app from "../../app/clientary.app";

export default defineAction({
  key: "clientary-create-expense",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Expense",
  description: "Creates a new expense. [See docs here](https://www.clientary.com/api/expenses)",
  type: "action",
  props: {
    app,
    amount: {
      type: "string",
      label: "Amount",
      description: "Expense amount. Must be a float or integer",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Expense description",
      optional: true,
    },
    incurredOn: {
      type: "string",
      label: "Incurred On",
      description: "The date the expense incurred on, e.g. `2022/11/17`",
      optional: true,
    },
    client: {
      propDefinition: [
        app,
        "clientId",
      ],
      description: "Client ID related to the expense",
      optional: true,
    },
    project: {
      propDefinition: [
        app,
        "projectId",
      ],
      description: "Project ID related to the expense",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getRequestMethod("createExpense")({
      $,
      data: {
        amount: parseFloat(this.amount),
        description: this.description,
        client_id: this.client,
        project_id: this.project,
        incurred_on: this.incurredOn,
      },
    });
    $.export("$summary", `Successfully created an expense (ID: ${response.id})`);
    return response;
  },
});
