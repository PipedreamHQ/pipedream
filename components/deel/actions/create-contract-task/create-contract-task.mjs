import app from "../../deel.app.mjs";

export default {
  key: "deel-create-contract-task",
  name: "Create Contract Task",
  description:
    "Add a task or milestone to a Deel `payg_tasks` contractor contract. Tasks represent discrete"
    + " deliverables with a defined amount and submission date."
    + " The contract must be in `active` status (fully signed by both parties) to accept tasks."
    + " Set `is_auto_approved` to `true` to automatically approve the task without manual review;"
    + " otherwise the task will require review via **Review Contract Task**."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/api/reference/endpoints/tasks/create-contract-task)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The payment amount for this task (e.g., `1500`).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the task or deliverable (e.g., `Deliver chaos theory report`).",
    },
    dateSubmitted: {
      type: "string",
      label: "Date Submitted",
      description: "The submission date for the task in ISO 8601 format (e.g., `2026-07-01`).",
    },
    isAutoApproved: {
      type: "boolean",
      label: "Auto-Approve",
      description: "Set to `true` to automatically approve the task. If `false`, the task requires manual review.",
      optional: true,
    },
  },
  async run({ $ }) {
    const amt = parseFloat(this.amount);
    if (!Number.isFinite(amt)) throw new Error(`Invalid amount: "${this.amount}" is not a finite number`);
    const payload = {
      amount: String(amt),
      description: this.description,
      date_submitted: this.dateSubmitted,
    };
    if (this.isAutoApproved !== undefined) payload.is_auto_approved = this.isAutoApproved;

    const response = await this.app.createContractTask($, this.contractId, payload);

    const task = response?.data ?? response;
    const taskId = task?.id ?? "unknown";
    $.export("$summary", `Created task ${taskId} on contract ${this.contractId}: ${this.description}`);
    return response;
  },
};
