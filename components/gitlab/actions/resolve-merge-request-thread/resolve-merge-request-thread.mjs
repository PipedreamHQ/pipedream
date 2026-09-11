import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-resolve-merge-request-thread",
  name: "Resolve Merge Request Thread",
  description: "Mark a merge request thread as resolved, or reopen a resolved one by setting **Resolved** to `false`. Use this after acting on a piece of review feedback — resolving threads is what clears a merge request's `blocking_discussions_resolved` flag so it can merge. Get the **Discussion ID** from **List Merge Request Discussions** (set its **Only Unresolved** to `true` to see just the threads still open). Only threads that are resolvable can be resolved: plain comments on the merge request as a whole are not, and GitLab rejects the attempt. [See the documentation](https://docs.gitlab.com/api/discussions/#resolve-a-merge-request-thread)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    discussionId: {
      propDefinition: [
        gitlab,
        "discussionId",
      ],
    },
    resolved: {
      type: "boolean",
      label: "Resolved",
      description: "`true` (the default) resolves the thread; `false` reopens a thread that was previously resolved.",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gitlab.updateMergeRequestDiscussion(
      this.projectId,
      this.mergeRequestIid,
      this.discussionId,
      {
        $,
        params: {
          resolved: this.resolved,
        },
      },
    );

    $.export("$summary", `${this.resolved
      ? "Resolved"
      : "Reopened"} thread ${this.discussionId} on merge request !${this.mergeRequestIid} in ${this.projectId}`);

    return response;
  },
};
