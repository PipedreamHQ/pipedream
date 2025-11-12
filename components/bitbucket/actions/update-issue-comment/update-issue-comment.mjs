import base from "../common/base.mjs";
const { bitbucket } = base.props;

export default {
  key: "bitbucket-update-issue-comment",
  name: "Update Issue Comment",
  description: "Updates a existent issue comment. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-issue-tracker/#api-repositories-workspace-repo-slug-issues-issue-id-comments-comment-id-put)",
  version: "0.1.5",
  annotations: {
    destructiveHint: true,
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
    commentId: {
      label: "Comment",
      description: "Select the comment",
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
  },
  async run({ $ }) {
    const {
      workspaceId,
      repositoryId,
      issueId,
      commentId,
      rawContent,
      htmlContent,
      markupContent,
    } = this;

    const response = await this.bitbucket.updateIssueComment({
      workspaceId,
      repositoryId,
      issueId,
      commentId,
      data: {
        content: {
          raw: rawContent,
          html: htmlContent,
          markup: markupContent,
        },
      },
    }, $);

    $.export("$summary", "Successfully updated issue comment");

    return response;
  },
};
