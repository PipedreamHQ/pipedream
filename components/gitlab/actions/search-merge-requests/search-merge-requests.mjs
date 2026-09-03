import gitlab from "../../gitlab.app.mjs";
import constants from "../../common/constants.mjs";
import {
  paginate,
  summarizeMergeRequest,
} from "../../common/utils.mjs";

export default {
  key: "gitlab-search-merge-requests",
  name: "Search Merge Requests",
  description: "Find merge requests whose title or description matches a search term. Use this when the user refers to a merge request by what it is about (\"the MR about the Redis cache refactor\", \"the payments migration MR\") rather than by number — it is the fastest way to turn a description into the `iid` that every other merge request tool needs. Use **List Merge Requests** instead when there is no text to match and you only want to filter by state, author, reviewer or branch. Narrow the search with **Project** or **Group**; with both blank GitLab searches across everything the authenticated user can see and defaults the scope to merge requests they created, so set **Scope** to `all` to widen it. Matching is case-insensitive substring, not fuzzy — prefer one or two distinctive words over a whole sentence. [See the documentation](https://docs.gitlab.com/api/merge_requests/#list-merge-requests)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gitlab,
    search: {
      type: "string",
      label: "Search",
      description: "Text to match against the merge request title and/or description (case-insensitive substring). Use a few distinctive keywords, e.g. `redis cache` rather than `the MR that refactors the Redis cache layer`.",
    },
    projectId: {
      propDefinition: [
        gitlab,
        "projectIdStatic",
      ],
      optional: true,
      description: "Limit the search to this project, given as a path (`group/project`, e.g. `backend/payments`) or a numeric project ID. Mutually exclusive with **Group**.",
    },
    groupId: {
      propDefinition: [
        gitlab,
        "groupIdStatic",
      ],
      optional: true,
      description: "Limit the search to every project in this group, given as a full path or a numeric group ID. Ignored when **Project** is set.",
    },
    searchIn: {
      type: "string",
      label: "Search In",
      description: "Which fields to match against. Defaults to `title,description`. Narrow to `title` when the user is quoting an MR name and description matches would be noise.",
      options: Object.values(constants.mergeRequests.searchIn),
      default: constants.mergeRequests.searchIn.TITLE_AND_DESCRIPTION,
      optional: true,
    },
    state: {
      propDefinition: [
        gitlab,
        "mergeRequestState",
      ],
      description: "Return merge requests in this state. Defaults to `opened`. Set to `all` when the merge request being looked for may already be merged or closed — a common case when searching by description.",
    },
    scope: {
      propDefinition: [
        gitlab,
        "mergeRequestScope",
      ],
    },
    maxResults: {
      propDefinition: [
        gitlab,
        "maxResults",
      ],
      default: 20,
      description: "Maximum number of matches to return in total, paginating as needed. Defaults to `20`, which is usually plenty for a lookup.",
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
      search: this.search,
      in: this.searchIn,
      state: this.state,
      scope: this.scope,
    };

    let requestFn;
    if (this.projectId) {
      requestFn = (requestParams) => this.gitlab.listProjectMergeRequests(this.projectId, {
        $,
        params: requestParams,
      });
    } else if (this.groupId) {
      requestFn = (requestParams) => this.gitlab.listGroupMergeRequests(this.groupId, {
        $,
        params: requestParams,
      });
    } else {
      requestFn = (requestParams) => this.gitlab.listMergeRequests({
        $,
        params: requestParams,
      });
    }

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

    const suffix = truncated
      ? " — capped at Max Results, there may be more"
      : "";
    $.export("$summary", `Found ${items.length} merge request${items.length === 1
      ? ""
      : "s"} matching "${this.search}"${suffix}`);

    return mergeRequests;
  },
};
