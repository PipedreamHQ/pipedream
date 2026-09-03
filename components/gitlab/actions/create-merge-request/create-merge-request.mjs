import { ConfigurationError } from "@pipedream/platform";
import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-create-merge-request",
  name: "Create Merge Request",
  description: "Open a new merge request from one branch into another. Use this for \"open an MR\", \"raise a merge request\", \"submit my branch for review\". Both branches must already exist in the project — use **List Repo Branches** to check, or **Create Branch** to make one. Reviewers and assignees are given as usernames and resolved to IDs automatically; a username that is not a member of the project is rejected rather than silently dropped. Set **Draft** to `true` for work that is not ready for review — GitLab expresses this by prefixing the title with `Draft:`, which this action does for you and which blocks merging until removed. After creating, use **Get Merge Request** to check its pipeline and merge readiness. [See the documentation](https://docs.gitlab.com/api/merge_requests/#create-mr)",
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
    sourceBranch: {
      propDefinition: [
        gitlab,
        "sourceBranchStatic",
      ],
    },
    targetBranch: {
      propDefinition: [
        gitlab,
        "targetBranchStatic",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The merge request title. Do not prefix it with `Draft:` by hand — set **Draft** instead.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The merge request description, in GitLab-flavored Markdown. Mentioning `Closes #123` links and closes that issue on merge.",
      optional: true,
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "Whether to open the merge request as a draft, which blocks merging until the draft flag is removed. Defaults to `false`.",
      default: false,
      optional: true,
    },
    reviewerUsernames: {
      type: "string[]",
      label: "Reviewer Usernames",
      description: "Usernames to request review from, e.g. `[\"jdoe\"]`. Resolved to user IDs automatically; each must be a member of the project.",
      optional: true,
    },
    assigneeUsernames: {
      type: "string[]",
      label: "Assignee Usernames",
      description: "Usernames to assign the merge request to. Resolved to user IDs automatically; each must be a member of the project.",
      optional: true,
    },
    labels: {
      propDefinition: [
        gitlab,
        "labelsStatic",
      ],
      description: "Labels to apply to the merge request, by name. Each must already exist in the project — GitLab *creates* a label it does not recognize rather than rejecting it, so a mis-cased or invented name silently adds a new project label. Use **List Project Labels** to get the exact names.",
    },
    removeSourceBranch: {
      type: "boolean",
      label: "Remove Source Branch",
      description: "Whether to delete the source branch when the merge request is merged. Defaults to the project's own setting when left blank.",
      optional: true,
    },
    squash: {
      type: "boolean",
      label: "Squash",
      description: "Whether to squash the commits into one when merging.",
      optional: true,
    },
  },
  methods: {
    /**
     * Usernames to numeric member IDs, which is what the create endpoint takes.
     * Rejects a username that is not a project member rather than dropping it,
     * so an unassignable reviewer surfaces instead of silently going missing.
     */
    async resolveUserIds($, usernames) {
      if (!usernames?.length) {
        return undefined;
      }
      const ids = [];
      for (const username of usernames) {
        const matches = await this.gitlab.searchProjectUsers(this.projectId, {
          $,
          params: {
            search: username,
          },
        });
        // Exact match only: GitLab's project users search also matches display
        // names, so a lone fuzzy hit would assign someone the caller never named.
        const user = matches?.find((candidate) => candidate.username === username);
        if (!user) {
          throw new ConfigurationError(`No project member matches the username \`${username}\` in ${this.projectId}. Use **List Project Members** to see who can be assigned.`);
        }
        ids.push(user.id);
      }
      return ids;
    },
  },
  async run({ $ }) {
    const [
      reviewerIds,
      assigneeIds,
    ] = await Promise.all([
      this.resolveUserIds($, this.reviewerUsernames),
      this.resolveUserIds($, this.assigneeUsernames),
    ]);

    const response = await this.gitlab.createMergeRequest(this.projectId, {
      $,
      data: {
        source_branch: this.sourceBranch,
        target_branch: this.targetBranch,
        title: this.draft
          ? `Draft: ${this.title}`
          : this.title,
        description: this.description,
        reviewer_ids: reviewerIds,
        assignee_ids: assigneeIds,
        labels: this.labels?.join(),
        remove_source_branch: this.removeSourceBranch,
        squash: this.squash,
      },
    });

    $.export("$summary", `Created merge request !${response.iid} in ${this.projectId}: ${response.title} (${this.sourceBranch} → ${this.targetBranch})`);

    return response;
  },
};
