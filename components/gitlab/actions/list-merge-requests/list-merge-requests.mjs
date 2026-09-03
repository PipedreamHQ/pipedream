import gitlab from "../../gitlab.app.mjs";
import constants from "../../common/constants.mjs";
import {
  paginate,
  selectMergeRequestScope,
  summarizeMergeRequest,
} from "../../common/utils.mjs";

export default {
  key: "gitlab-list-merge-requests",
  name: "List Merge Requests",
  description: "List merge requests, filtered by project, group, state, author, assignee, reviewer, labels or target branch. Use this for any \"what merge requests are …\" question — open MRs in a project, MRs waiting on my review (set **Scope** to `reviews_for_me`), MRs assigned to me, MRs targeting a release branch. Use **Search Merge Requests** instead when you have text to match against a title or description. Set **Project** to scope to one project, **Group** to scope to a whole group, or leave both blank to search across everything the authenticated user can see — note that with both blank GitLab defaults **Scope** to `created_by_me`, so pass `all` to widen it. Results are summarized by default; set **Detail** to `full` for the complete merge request objects. The returned `iid` is what every other merge request tool needs. [See the documentation](https://docs.gitlab.com/api/merge_requests/#list-merge-requests)",
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
      optional: true,
      description: "Limit results to this project, given as a path (`group/project`, e.g. `backend/payments`) or a numeric project ID. Leave blank to search across projects. Mutually exclusive with **Group**.",
    },
    groupId: {
      propDefinition: [
        gitlab,
        "groupIdStatic",
      ],
      optional: true,
      description: "Limit results to every project in this group, given as a full path (e.g. `backend`) or a numeric group ID. Cannot be combined with **Project** — setting both is rejected.",
    },
    state: {
      propDefinition: [
        gitlab,
        "mergeRequestState",
      ],
    },
    scope: {
      propDefinition: [
        gitlab,
        "mergeRequestScope",
      ],
    },
    authorUsername: {
      type: "string",
      label: "Author Username",
      description: "Return only merge requests opened by this username (e.g. `jdoe`), not their display name. Use **List Project Members** to look up usernames.",
      optional: true,
    },
    assigneeUsername: {
      type: "string",
      label: "Assignee Username",
      description: "Return only merge requests assigned to this username.",
      optional: true,
    },
    reviewerUsername: {
      type: "string",
      label: "Reviewer Username",
      description: "Return only merge requests where this username is a reviewer. `None` returns merge requests with no reviewer, `Any` those with any reviewer. To find what is waiting on the *authenticated* user, set **Scope** to `reviews_for_me` instead.",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Return only merge requests carrying **all** of these labels. `None` matches merge requests with no labels, `Any` those with at least one.",
      optional: true,
    },
    targetBranch: {
      type: "string",
      label: "Target Branch",
      description: "Return only merge requests targeting this branch (e.g. `main`, `release/24.1`).",
      optional: true,
    },
    sourceBranch: {
      type: "string",
      label: "Source Branch",
      description: "Return only merge requests originating from this branch.",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description: "Return only merge requests updated on or after this time. ISO 8601, e.g. `2026-08-01T00:00:00Z`.",
      optional: true,
    },
    orderBy: {
      propDefinition: [
        gitlab,
        "mergeRequestOrderBy",
      ],
    },
    sort: {
      propDefinition: [
        gitlab,
        "sortDirection",
      ],
    },
    maxResults: {
      propDefinition: [
        gitlab,
        "maxResults",
      ],
    },
    detail: {
      propDefinition: [
        gitlab,
        "detail",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      state: this.state,
      scope: this.scope,
      author_username: this.authorUsername,
      // Documented as an array parameter, unlike the author/reviewer filters.
      assignee_username: this.assigneeUsername && [
        this.assigneeUsername,
      ],
      reviewer_username: this.reviewerUsername,
      labels: this.labels?.join(),
      target_branch: this.targetBranch,
      source_branch: this.sourceBranch,
      updated_after: this.updatedAfter,
      order_by: this.orderBy,
      sort: this.sort,
    };

    const {
      requestFn, where,
    } = selectMergeRequestScope(this.gitlab, {
      projectId: this.projectId,
      groupId: this.groupId,
      $,
    });

    const {
      items, truncated,
    } = await paginate({
      requestFn,
      params,
      maxResults: this.maxResults,
    });

    const mergeRequests = this.detail === constants.mergeRequests.detail.FULL
      ? items
      : items.map(summarizeMergeRequest);

    const state = this.state && this.state !== constants.mergeRequests.states.ALL
      ? `${this.state} `
      : "";
    const suffix = truncated
      ? " — capped at Max Results, there may be more"
      : "";
    $.export("$summary", `Returned ${items.length} ${state}merge request${items.length === 1
      ? ""
      : "s"}${where}${suffix}`);

    return mergeRequests;
  },
};
