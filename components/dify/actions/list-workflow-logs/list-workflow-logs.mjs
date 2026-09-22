import dify from "../../dify.app.mjs";

export default {
  key: "dify-list-workflow-logs",
  name: "List Workflow Logs",
  description: "List past runs of a Dify **Workflow** app, newest first, with each run's status, token usage, step count, and timing. Only Workflow apps record these logs: a Chatflow, Chatbot, Agent, or Text Generator app's key returns an empty page, not an error. For runs started through the API, `created_by_end_user.session_id` is the `User` value sent with that run, which is useful for tracing a run back to its caller and for filtering with `User`. Runs started by a team member inside Dify have `created_by_end_user: null` and an account under `created_by_account` instead. Each entry is a run-level summary; node-by-node execution logs for finished runs aren't available. Example: `Status` `failed`, `Limit` `5` → `{ data: [{ id, created_by_role: \"end_user\", created_by_end_user: { id, session_id: \"user-123\", type: \"service-api\" }, workflow_run: { id, status: \"failed\", error, total_tokens, elapsed_time } }], page: 1, limit: 5, total: 12, has_more: true }`. If `has_more` is `true`, call again with `Page` incremented by one. [See the documentation](https://docs.dify.ai/en/api-reference/workflow-runs/list-workflow-logs)",
  version: "0.0.1",
  ai: "optimized",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    dify,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Keyword to search for in the logs, e.g. `invoice`.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only return runs that ended with this status.",
      options: [
        "succeeded",
        "failed",
        "stopped",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        dify,
        "user",
      ],
      description: "Only return runs started with this `User` value (Dify calls it the end user's session ID, shown as `created_by_end_user.session_id`), e.g. `user_workflow_123`. Omit to see runs from all end users.",
      optional: true,
    },
    createdByAccount: {
      type: "string",
      label: "Created By Account",
      description: "Only return runs started by the Dify team member with this account email, e.g. `name@example.com`. Returns an `invalid_param` error if no account matches.",
      optional: true,
    },
    createdAtAfter: {
      type: "string",
      label: "Created After",
      description: "Only return runs created after this ISO 8601 timestamp, e.g. `2026-01-01T00:00:00Z`.",
      optional: true,
    },
    createdAtBefore: {
      type: "string",
      label: "Created Before",
      description: "Only return runs created before this ISO 8601 timestamp, e.g. `2026-02-01T00:00:00Z`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number, starting at `1`. Keep incrementing while the response's `has_more` is `true`. Defaults to `1`.",
      min: 1,
      max: 99999,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of runs to return per page, between `1` and `100`. Defaults to `20`.",
      min: 1,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dify.listWorkflowLogs({
      $,
      params: {
        keyword: this.keyword,
        status: this.status,
        created_by_end_user_session_id: this.user,
        created_by_account: this.createdByAccount,
        created_at__after: this.createdAtAfter,
        created_at__before: this.createdAtBefore,
        page: this.page,
        limit: this.limit,
      },
    });

    $.export("$summary", `Found ${response.data.length} workflow run(s) of ${response.total} total`);
    return response;
  },
};
