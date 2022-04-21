import common from "../common/common.mjs";
import constants from "../common/constants.mjs";
const { bitbucket } = common.props;

export default {
  key: "bitbucket-create-issue",
  name: "Creates a new issue",
  description: "Creates a new issue. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-issue-tracker/#api-repositories-workspace-repo-slug-issues-post)",
  version: "0.1.2",
  type: "action",
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
    title: {
      label: "Title",
      description: "The title of the issue",
      type: "string",
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
    assigneeId: {
      label: "Assignee",
      description: "Select a user",
      propDefinition: [
        bitbucket,
        "user",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    state: {
      label: "State",
      description: "The state of the issue",
      type: "string",
      default: constants.ISSUE_STATES[0],
      options: constants.ISSUE_STATES,
      optional: true,
    },
    kind: {
      label: "Kind",
      description: "The kind of the issue",
      type: "string",
      default: constants.ISSUE_KINDS[0],
      options: constants.ISSUE_KINDS,
      optional: true,
    },
    priority: {
      label: "Priority",
      description: "The priority of the issue",
      type: "string",
      default: constants.ISSUE_PRIORITIES[0],
      options: constants.ISSUE_PRIORITIES,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      workspaceId,
      repositoryId,
      title,
      rawContent,
      htmlContent,
      markupContent,
      assigneeId,
      state,
      kind,
      priority,
    } = this;

    const response = await this.bitbucket.createIssue({
      workspaceId,
      repositoryId,
      data: {
        title,
        assigneeId,
        content: {
          raw: rawContent,
          html: htmlContent,
          markup: markupContent,
        },
        state,
        kind,
        priority,
      },
    }, $);

    $.export("summary", "Successfully created issue");

    return response;
  },
};
