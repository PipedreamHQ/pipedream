import gitlab from "../../gitlab.app.mjs";

const APPROVE = "approve";
const UNAPPROVE = "unapprove";

export default {
  key: "gitlab-approve-merge-request",
  name: "Approve Merge Request",
  description: "Approve a merge request as the authenticated user, or withdraw an earlier approval by setting **Action** to `unapprove`. Call **Get Merge Request** first to check the merge request is actually ready — its `readiness` rollup reports the pipeline status, conflicts and how many approvals are still required — and **Get Merge Request Diffs** to read the changes being approved. Two things commonly go wrong: GitLab **refuses to let you approve your own merge request**, and a project may require approval from a specific approval rule that the authenticated user does not satisfy; both surface as a `401`. To approve as part of leaving review feedback in one step, use **Create Merge Request Review** with its **Action** set to `approve` instead. Optionally pass **SHA** to make the approval conditional on the merge request's head commit, so it fails rather than silently approving work that was pushed after you read the diff. [See the documentation](https://docs.gitlab.com/api/merge_request_approvals/#approve-merge-request)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectIdStatic",
      ],
    },
    mergeRequestIid: {
      propDefinition: [
        gitlab,
        "mergeRequestIid",
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "`approve` (the default) records an approval; `unapprove` removes one the authenticated user gave earlier. There is no REST equivalent of GitLab's *Request changes* reviewer state — to block a merge request, `unapprove` it and explain why with **Create Merge Request Comment**.",
      options: [
        APPROVE,
        UNAPPROVE,
      ],
      default: APPROVE,
      optional: true,
    },
    sha: {
      type: "string",
      label: "SHA",
      description: "Optional head commit SHA to approve. When set, GitLab rejects the approval if the merge request's head has moved on — use the `diff_refs.head_sha` returned by **Get Merge Request** to be sure you are approving the code you read. Ignored when **Action** is `unapprove`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.action === UNAPPROVE) {
      const response = await this.gitlab.unapproveMergeRequest(
        this.projectId,
        this.mergeRequestIid,
        {
          $,
        },
      );
      $.export("$summary", `Removed approval from merge request !${this.mergeRequestIid} in ${this.projectId}`);
      return response;
    }

    const response = await this.gitlab.approveMergeRequest(
      this.projectId,
      this.mergeRequestIid,
      {
        $,
        data: {
          sha: this.sha,
        },
      },
    );

    const remaining = response?.approvals_left;
    const status = remaining === undefined
      ? ""
      : remaining > 0
        ? ` — ${remaining} approval${remaining === 1
          ? ""
          : "s"} still required`
        : " — fully approved";

    $.export("$summary", `Approved merge request !${this.mergeRequestIid} in ${this.projectId}${status}`);

    return response;
  },
};
