import app from "../../deel.app.mjs";

export default {
  key: "deel-review-contract-task",
  name: "Review Contract Task",
  description:
    "Approve or decline a contractor task on a Deel IC contract."
    + " `status` must be `approved` or `declined`."
    + " If declining, provide a `reason` explaining why."
    + " Use **List Contract Tasks** to find task IDs."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/docs/review-a-task)",
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
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The unique identifier of the task to review. Use **List Contract Tasks** to find task IDs.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The review decision. Must be `approved` or `declined`.",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for declining the task. Required when `status` is `declined`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      status: this.status,
    };
    if (this.reason) payload.reason = this.reason;

    const response = await this.app._makeRequest({
      $,
      path: `/contracts/${this.contractId}/tasks/${this.taskId}/reviews`,
      method: "POST",
      data: {
        data: payload,
      },
    });

    $.export("$summary", `Task ${this.taskId} on contract ${this.contractId}: ${this.status}`);
    return response;
  },
};
