import common from "../common/common.mjs";
const { bitbucket } = common.props;
import constants from "../common/constants.mjs";

export default {
  ...common,
  type: "source",
  name: "New Pull Request (Instant)",
  key: "bitbucket-new-pull-request",
  description: "Emit new event when a new pull request is created in a repository. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
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
        "pullrequest:created",
      ];
    },
    async loadHistoricalData() {
      const pullRequests = await this.bitbucket.getPullRequests({
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        params: {
          page: 1,
          pagelen: constants.HISTORICAL_DATA_LENGTH,
        },
      });
      return pullRequests.map((pullRequest) => ({
        main: pullRequest,
        sub: {
          id: pullRequest.id,
          summary: `New pull request ${pullRequest.title} created`,
          ts: Date.parse(pullRequest.date),
        },
      }));
    },
    proccessEvent(event) {
      const { pullrequest } = event.body;

      this.$emit(pullrequest, {
        id: pullrequest.id,
        summary: `New pull request ${pullrequest.title} created`,
        ts: Date.parse(pullrequest.created_on),
      });
    },
  },
};
