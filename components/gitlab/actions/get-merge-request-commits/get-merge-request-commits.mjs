import gitlab from "../../gitlab.app.mjs";
import constants from "../../common/constants.mjs";
import {
  paginate,
  summarizeCommit,
} from "../../common/utils.mjs";

export default {
  key: "gitlab-get-merge-request-commits",
  name: "Get Merge Request Commits",
  description: "List the commits contained in a merge request, newest first. Use this to understand how a change was built up — whether it is one clean commit or a long history to squash, who wrote each part, and what the commit messages claim. For the actual code changes call **Get Merge Request Diffs** instead; for merge readiness call **Get Merge Request**. [See the documentation](https://docs.gitlab.com/api/merge_requests/#get-single-merge-request-commits)",
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
      description: "How much of each commit to return. `summary` (the default) returns SHA, title, author and date. Use `full` for the complete commit objects, including the full message body and stats.",
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await paginate({
      requestFn: (params) => this.gitlab.listMergeRequestCommits(
        this.projectId,
        this.mergeRequestIid,
        {
          $,
          params,
        },
      ),
      maxResults: this.maxResults,
    });

    const commits = this.detail === constants.mergeRequests.detail.FULL
      ? items
      : items.map(summarizeCommit);

    const suffix = truncated
      ? " — capped at Max Results, there may be more"
      : "";
    $.export("$summary", `Retrieved ${items.length} commit${items.length === 1
      ? ""
      : "s"} for merge request !${this.mergeRequestIid} in ${this.projectId}${suffix}`);

    return commits;
  },
};
