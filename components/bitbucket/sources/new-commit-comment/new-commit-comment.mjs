import common from "../common/common.mjs";
import constants from "../common/constants.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Commit Comment (Instant)",
  key: "bitbucket-new-commit-comment",
  description: "Emit new event when a commit receives a comment. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
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
        "repo:commit_comment_created",
      ];
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

      if (commits?.length) {
        let counter = 0;
        let comments = [];
        do {
          const response = await this.bitbucket.getCommitComments({
            workspaceId: this.workspaceId,
            repositoryId: this.repositoryId,
            commitId: commits[counter].hash,
            params: {
              page: 1,
              pagelen: constants.HISTORICAL_DATA_LENGTH,
            },
          });
          comments = [
            ...comments,
            ...response,
          ];
          counter++;
          if (comments.length > constants.HISTORICAL_DATA_LENGTH) {
            break;
          }
          if (counter >= commits.length - 1) {
            break;
          }
        } while (true);

        return comments.map((comment) => ({
          main: comment,
          sub: {
            id: comment.id,
            summary: `New comment created on commit ${comment.commit.hash}`,
            ts: Date.parse(comment.created_on),
          },
        }));
      }
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
