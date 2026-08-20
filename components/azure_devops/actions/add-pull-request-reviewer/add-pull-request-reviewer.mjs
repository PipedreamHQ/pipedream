// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { PULL_REQUEST_VOTE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-add-pull-request-reviewer",
  name: "Add Pull Request Reviewer",
  description: "Add a reviewer to a pull request, optionally marking them required or casting their vote. Returns the reviewer entry including their current vote. Use this to route a pull request to the right owner automatically. Example: pull request `12`, reviewer `8ebabf04-0b08-6a43-9bf4-96e1f4aa3682`, vote `Approved`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-reviewers/create-pull-request-reviewer?view=azure-devops-rest-7.1)",
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
    reviewerId: {
      type: "string",
      label: "Reviewer ID",
      description: "Identity GUID of the user or group to add as a reviewer. Run the **List Users** action first to obtain valid values.",
    },
    vote: {
      type: "integer",
      label: "Vote",
      description: "Vote to cast on behalf of the reviewer. Defaults to no vote.",
      options: PULL_REQUEST_VOTE_OPTIONS,
      default: 0,
      optional: true,
    },
    isRequired: {
      type: "boolean",
      label: "Is Required",
      description: "Mark the reviewer as a required reviewer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.createPullRequestReviewer({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      pullRequestId: this.pullRequestId,
      reviewerId: this.reviewerId,
      data: {
        vote: this.vote,
        isRequired: this.isRequired,
      },
    });
    $.export("$summary", `Added reviewer ${this.reviewerId} to pull request ${this.pullRequestId}`);
    return response;
  },
};
