import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Pull Request (Instant)",
  key: "bitbucket-new-pull-request",
  description: "Emit new event when a new pull request is created in a repository. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
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
