import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Commit Comment (Instant)",
  key: "bitbucket-new-commit-comment",
  description: "Emit new event when a commit receives a comment. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
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
        "repo:commit_comment_created",
      ];
    },
    proccessEvent(event) {
      const { comment } = event.body;

      this.$emit(comment, {
        id: comment.id,
        summary: `New comment created on commit ${comment.commit.hash}`,
        ts: Date.parse(comment.created_on),
      });
    },
  },
};
