import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import { PULL_REQUEST_UPDATE_STATUS_OPTIONS } from "../../common/constants.mjs";
import { compactFields } from "../../common/utils.mjs";

export default {
  key: "azure_devops-update-pull-request",
  name: "Update Pull Request",
  description: "Update a pull request - retitle it, edit its description, retarget it, publish a draft, or complete or abandon it. At least one field is required. Returns the updated pull request. Use status `completed` to merge and `abandoned` to close without merging. Example: pull request `12`, status `abandoned`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/update?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    title: {
      propDefinition: [
        azureDevops,
        "pullRequestTitle",
      ],
      description: "New title of the pull request (max 400 chars)",
      optional: true,
    },
    description: {
      propDefinition: [
        azureDevops,
        "pullRequestDescription",
      ],
      description: "New description of the pull request (max 4000 chars)",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "New status. Set `completed` to merge the pull request or `abandoned` to close it without merging.",
      options: PULL_REQUEST_UPDATE_STATUS_OPTIONS,
      optional: true,
    },
    targetRefName: {
      propDefinition: [
        azureDevops,
        "targetRefName",
      ],
      description: "Retarget the pull request at this fully qualified branch name, e.g. `refs/heads/main`",
      optional: true,
    },
    isDraft: {
      propDefinition: [
        azureDevops,
        "isDraft",
      ],
      description: "Set to `false` to publish a draft pull request",
    },
  },
  async run({ $ }) {
    const data = compactFields({
      title: this.title,
      description: this.description,
      status: this.status,
      targetRefName: this.targetRefName,
      isDraft: this.isDraft,
    });
    if (!Object.keys(data).length) {
      throw new ConfigurationError("Provide at least one field to update.");
    }

    const response = await this.azureDevops.updatePullRequest({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      pullRequestId: this.pullRequestId,
      data,
    });
    $.export("$summary", `Updated pull request ${response.pullRequestId}: set ${Object.keys(data).join(", ")}`);
    return response;
  },
};
