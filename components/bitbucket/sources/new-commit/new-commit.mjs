import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Commit (Instant)",
  key: "bitbucket-new-commit",
  description: "Emit new event when a new commit is pushed to a branch. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
  version: "0.0.3",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repository",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    branchName: {
      propDefinition: [
        bitbucket,
        "branch",
        (c) => ({
          workspaceId: c.workspaceId,
          repositoryId: c.repositoryId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getPath() {
      return `repositories/${this.workspaceId}/${this.repositoryId}/hooks`;
    },
    getWebhookEventTypes() {
      return [
        "repo:push",
      ];
    },
    isEventForThisBranch(change, branchName) {
      return change.new.name === branchName;
    },
    doesEventContainNewCommits(change) {
      return change.commits && change.commits.length > 0;
    },
    async proccessEvent(event) {
      const { push } = event.body;

      if (!push || !push.changes) return;

      push.changes.forEach((change) => {
        if (!this.isEventForThisBranch(change, this.branchName) ||
          !this.doesEventContainNewCommits(change)) { return; }

        change.commits.forEach((commit) => {
          this.$emit(commit, {
            id: commit.hash,
            summary: `New commit created on branch ${change.new.name}`,
            ts: Date.parse(commit.date),
          });
        });
      });
    },
  },
};
