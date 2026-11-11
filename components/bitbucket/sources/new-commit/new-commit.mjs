import common from "../common/common.mjs";
import constants from "../common/constants.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Commit (Instant)",
  key: "bitbucket-new-commit",
  description: "Emit new event when a new commit is pushed to a branch. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
  version: "0.0.6",
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
      optional: true,
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
      return !branchName || change.new.name === branchName;
    },
    doesEventContainNewCommits(change) {
      return change.commits && change.commits.length > 0;
    },
    async loadHistoricalData() {
      const commits = await this.bitbucket.getCommits({
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        params: {
          include: this.branchName,
          page: 1,
          pagelen: constants.HISTORICAL_DATA_LENGTH,
        },
      });
      return commits.map((commit) => ({
        main: commit,
        sub: {
          id: commit.hash,
          summary: `New commit created on branch ${commit.message}`,
          ts: Date.parse(commit.date),
        },
      }));
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
