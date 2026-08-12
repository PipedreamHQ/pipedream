import base from "../common/base.mjs";
const { bitbucket } = base.props;

export default {
  key: "bitbucket-get-issue",
  name: "Get issue",
  description: "Get a issue. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-issue-tracker/#api-repositories-workspace-repo-slug-issues-issue-id-get). **Deprecated: Atlassian is removing Bitbucket Issues in mid-August 2026, and this action stops working once the feature is gone. There is no Bitbucket replacement.** [See the sunset announcement](https://community.atlassian.com/forums/Bitbucket-articles/Announcing-sunset-of-Bitbucket-Issues-and-Wikis/ba-p/3193882)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...base.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repository",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    issueId: {
      propDefinition: [
        bitbucket,
        "issue",
        (c) => ({
          workspaceId: c.workspaceId,
          repositoryId: c.repositoryId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      workspaceId,
      repositoryId,
      issueId,
    } = this;

    const response = await this.bitbucket.getIssue({
      workspaceId,
      repositoryId,
      issueId,
    }, $);

    $.export("$summary", "Successfully retrieved issue");

    return response;
  },
};
