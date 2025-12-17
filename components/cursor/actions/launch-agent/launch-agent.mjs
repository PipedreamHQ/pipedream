import cursor from "../../cursor.app.mjs";
import { formatImages } from "../../common/utils.mjs";

export default {
  key: "cursor-launch-agent",
  name: "Launch Agent",
  description: "Launch a Cursor agent. [See the documentation](https://cursor.com/docs/cloud-agent/api/endpoints#launch-an-agent)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cursor,
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The instruction text for the agent",
    },
    sourceRepository: {
      propDefinition: [
        cursor,
        "sourceRepository",
      ],
    },
    sourceRef: {
      type: "string",
      label: "Source Ref",
      description: "Git ref (branch name, tag, or commit hash) to use as the base branch",
      optional: true,
    },
    model: {
      propDefinition: [
        cursor,
        "model",
      ],
      optional: true,
    },
    autoCreatePr: {
      type: "boolean",
      label: "Auto Create PR",
      description: "Whether to automatically create a pull request when the agent completes",
      default: false,
      optional: true,
    },
    openAsCursorGithubApp: {
      type: "boolean",
      label: "Open as Cursor Github App",
      description: "Whether to open the pull request as the Cursor GitHub App instead of as the user. Only applies if autoCreatePr is true.",
      optional: true,
    },
    skipReviewerRequest: {
      type: "boolean",
      label: "Skip Reviewer Request",
      description: "Whether to skip adding the user as a reviewer to the pull request. Only applies if autoCreatePr is true and the PR is opened as the Cursor GitHub App.",
      optional: true,
    },
    targetBranch: {
      type: "string",
      label: "Target Branch",
      description: "Custom branch name for the agent to create",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "URL to receive webhook notifications about agent status changes",
      optional: true,
    },
    images: {
      propDefinition: [
        cursor,
        "images",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.cursor.launchAgent({
      $,
      data: {
        prompt: {
          text: this.prompt,
          images: await formatImages(this.images),
        },
        model: this.model,
        source: {
          repository: this.sourceRepository,
          ref: this.sourceRef,
        },
        target: {
          autoCreatePr: this.autoCreatePr,
          openAsCursorGithubApp: this.openAsCursorGithubApp,
          skipReviewerRequest: this.skipReviewerRequest,
          branchName: this.targetBranch,
        },
        webhook: this.webhookUrl
          ? {
            url: this.webhookUrl,
          }
          : undefined,
      },
    });
    $.export("$summary", `Successfully launched agent with ID ${response.id}`);
    return response;
  },
};
