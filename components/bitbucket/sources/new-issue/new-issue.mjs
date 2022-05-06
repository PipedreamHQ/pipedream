import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Issue (Instant)",
  key: "bitbucket-new-issue",
  description: "Emit new event when a new issue receives is created in a repository. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
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
        "issue:created",
      ];
    },
    proccessEvent(event) {
      const { issue } = event.body;

      this.$emit(issue, {
        id: issue.id,
        summary: `New issue ${issue.title} created`,
        ts: Date.parse(issue.created_on),
      });
    },
  },
};
