import base from "../common/base.mjs";
const { bitbucket } = base.props;

export default {
  key: "bitbucket-create-issue-comment",
  name: "Create Issue Comment",
  description: "Creates a new issue comment. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-issue-tracker/#api-repositories-workspace-repo-slug-issues-issue-id-comments-post). **Deprecated: Atlassian is removing Bitbucket Issues in mid-August 2026, and this action stops working once the feature is gone. There is no Bitbucket replacement.** [See the sunset announcement](https://community.atlassian.com/forums/Bitbucket-articles/Announcing-sunset-of-Bitbucket-Issues-and-Wikis/ba-p/3193882)",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    rawContent: {
      propDefinition: [
        bitbucket,
        "rawContent",
      ],
    },
    htmlContent: {
      propDefinition: [
        bitbucket,
        "htmlContent",
      ],
    },
    markupContent: {
      propDefinition: [
        bitbucket,
        "markupContent",
      ],
    },
    parent: {
      label: "Comment Parent",
      description: "The comment that will be replied",
      type: "string",
      propDefinition: [
        bitbucket,
        "comment",
        (c) => ({
          workspaceId: c.workspaceId,
          repositoryId: c.repositoryId,
          issueId: c.issueId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      workspaceId,
      repositoryId,
      issueId,
      parent,
      rawContent,
      htmlContent,
      markupContent,
    } = this;

    const response = await this.bitbucket.createIssueComment({
      workspaceId,
      repositoryId,
      issueId,
      data: {
        parent,
        content: {
          raw: rawContent,
          html: htmlContent,
          markup: markupContent,
        },
      },
    }, $);

    $.export("$summary", "Successfully created issue comment");

    return response;
  },
};
