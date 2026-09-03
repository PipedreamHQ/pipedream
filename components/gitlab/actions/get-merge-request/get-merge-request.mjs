import gitlab from "../../gitlab.app.mjs";
import constants from "../../common/constants.mjs";
import {
  mergeRequestReadiness,
  summarizeMergeRequest,
} from "../../common/utils.mjs";

export default {
  key: "gitlab-get-merge-request",
  name: "Get Merge Request",
  description: "Get a single merge request together with a `readiness` rollup that answers \"can this be merged?\" in one call — state, draft flag, `detailed_merge_status`, conflict flag, whether blocking threads are resolved, head pipeline status, and the approval count with who has approved. Use this to open or inspect a merge request, and before approving or merging one. It does **not** return the code changes: call **Get Merge Request Diffs** for those, and **List Merge Request Discussions** for existing review comments. If you only know the merge request by title, resolve its `iid` with **Search Merge Requests** first. The response also carries `diff_refs`, the commit SHAs needed to anchor inline comments — no other tool needs to fetch them. [See the documentation](https://docs.gitlab.com/api/merge_requests/#get-single-merge-request)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    detail: {
      propDefinition: [
        gitlab,
        "detail",
      ],
      description: "How much of the merge request to return. `summary` (the default) returns the identifying and triage fields plus the description. Use `full` for the complete object, including time stats, references and pipeline details.",
    },
  },
  async run({ $ }) {
    const mergeRequest = await this.gitlab.getMergeRequest(this.projectId, this.mergeRequestIid, {
      $,
    });

    // Approvals and pipelines only enrich the readiness rollup. An instance with
    // approvals disabled, or a project the token cannot read pipelines for,
    // should still return the merge request rather than failing outright.
    const [
      approvals,
      pipelines,
    ] = await Promise.all([
      this.gitlab.getMergeRequestApprovals(this.projectId, this.mergeRequestIid, {
        $,
      })
        .catch(() => undefined),
      this.gitlab.listMergeRequestPipelines(this.projectId, this.mergeRequestIid, {
        $,
        params: {
          per_page: 1,
        },
      })
        .catch(() => undefined),
    ]);

    const readiness = mergeRequestReadiness(mergeRequest, approvals, pipelines);

    const summary = [
      mergeRequest.state,
      `merge status: ${readiness.detailed_merge_status ?? "unknown"}`,
      readiness.pipeline_status && `pipeline: ${readiness.pipeline_status}`,
      readiness.approvals_left !== undefined && `approvals left: ${readiness.approvals_left}`,
    ]
      .filter(Boolean)
      .join(", ");

    $.export("$summary", `Retrieved merge request !${this.mergeRequestIid} in ${this.projectId}: ${mergeRequest.title} (${summary})`);

    return {
      merge_request: this.detail === constants.mergeRequests.detail.FULL
        ? mergeRequest
        : {
          ...summarizeMergeRequest(mergeRequest),
          description: mergeRequest.description,
        },
      readiness,
      diff_refs: mergeRequest.diff_refs,
    };
  },
};
