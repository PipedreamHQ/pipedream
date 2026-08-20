// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import { COMMENT_THREAD_STATUS_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-create-pull-request-comment",
  name: "Create Pull Request Comment",
  description: "Start a new comment thread on a pull request, either on the overview or anchored to a line in a file. Returns the new thread with its id. Use this to post automated review findings where the reviewer will see them. Example: pull request `12`, file `/src/index.js` line `42`, comment `This drops the null check`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-threads/create?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    project: {
      propDefinition: [
        azureDevops,
        "project",
      ],
    },
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
    },
    pullRequestId: {
      propDefinition: [
        azureDevops,
        "pullRequestId",
      ],
    },
    content: {
      propDefinition: [
        azureDevops,
        "commentText",
      ],
    },
    status: {
      type: "string",
      label: "Thread Status",
      description: "Status to open the thread in. Defaults to `active`.",
      options: COMMENT_THREAD_STATUS_OPTIONS,
      default: "active",
      optional: true,
    },
    filePath: {
      propDefinition: [
        azureDevops,
        "filePath",
      ],
      description: "Repository-relative path of the file to anchor the thread to, e.g. `/src/index.js`. Omit to comment on the pull request overview.",
      optional: true,
    },
    rightFileLine: {
      type: "integer",
      label: "Line Number",
      description: "Line in the file's right-hand (new) side to anchor the thread to. Requires **File Path**.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.rightFileLine && !this.filePath) {
      throw new ConfigurationError("**Line Number** anchors the thread to a line of a file, so **File Path** is required alongside it.");
    }
    const threadContext = this.filePath
      ? {
        filePath: this.filePath,
        rightFileStart: this.rightFileLine
          ? {
            line: this.rightFileLine,
            offset: 1,
          }
          : undefined,
        rightFileEnd: this.rightFileLine
          ? {
            line: this.rightFileLine,
            offset: 2,
          }
          : undefined,
      }
      : undefined;

    const response = await this.azureDevops.createPullRequestThread({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      pullRequestId: this.pullRequestId,
      data: {
        status: this.status,
        threadContext,
        comments: [
          {
            parentCommentId: 0,
            content: this.content,
            commentType: "text",
          },
        ],
      },
    });
    $.export("$summary", `Created comment thread ${response.id} on pull request ${this.pullRequestId}`);
    return response;
  },
};
