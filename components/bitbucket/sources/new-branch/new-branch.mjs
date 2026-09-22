import common from "../common/common.mjs";
import constants from "../common/constants.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Branch (Instant)",
  key: "bitbucket-new-branch",
  description: "Emit new event when a new branch is created. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
  version: "0.0.5",
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
    isNewBranch(change) {
      return !change.new || change.old || change.new?.type !== "branch";
    },
    async loadHistoricalData() {
      const branches = await this.bitbucket.getBranches({
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        params: {
          page: 1,
          pagelen: constants.HISTORICAL_DATA_LENGTH,
        },
      });
      const ts = new Date().getTime();
      return branches.map((branch) => ({
        main: branch,
        sub: {
          id: `${branch.name}-${ts}`,
          summary: `New branch ${branch.name} created`,
          ts,
        },
      }));
    },
    async proccessEvent(event) {
      const { push } = event.body;

      if (!push || !push.changes) return;

      push.changes.forEach((change) => {
        if (!this.isNewBranch(change)) return;

        const ts = new Date().getTime();

        this.$emit(change, {
          id: `${change.new.name}-${ts}`,
          summary: `New branch ${change.new.name} created`,
          ts,
        });
      });
    },
  },
};
