import app from "../../deel.app.mjs";

export default {
  key: "deel-list-contract-tasks",
  name: "List Contract Tasks",
  description:
    "List all tasks for a specific Deel IC contract. Returns task IDs, descriptions, amounts, statuses,"
    + " and submission dates."
    + " Use task IDs with **Review Contract Task** to approve or decline pending tasks."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/api/reference/endpoints/tasks/get-contract-tasks)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listContractTasks($, this.contractId);

    const tasks = response?.data ?? response ?? [];
    $.export("$summary", `Retrieved ${Array.isArray(tasks)
      ? tasks.length
      : 0} tasks for contract ${this.contractId}`);
    return response;
  },
};
