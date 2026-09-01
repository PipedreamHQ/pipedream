// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-create-pull-request",
  name: "Create Pull Request",
  description: "Open a pull request between two branches. Returns the new pull request's id and url. Use this after pushing a working branch, to start review. Example: source `refs/heads/feature/login` into target `refs/heads/main`, title `Add SSO login`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/create?view=azure-devops-rest-7.1)",
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
    sourceRefName: {
      propDefinition: [
        azureDevops,
        "targetRefName",
      ],
      label: "Source Branch",
      description: "Fully qualified name of the branch the changes come from, e.g. `refs/heads/feature/login`. Run the **List Branches And Tags** action first to obtain valid values.",
    },
    targetRefName: {
      propDefinition: [
        azureDevops,
        "targetRefName",
      ],
    },
    title: {
      propDefinition: [
        azureDevops,
        "pullRequestTitle",
      ],
    },
    description: {
      propDefinition: [
        azureDevops,
        "pullRequestDescription",
      ],
      optional: true,
    },
    isDraft: {
      propDefinition: [
        azureDevops,
        "isDraft",
      ],
      description: "Open the pull request as a draft",
    },
    reviewerIds: {
      type: "string[]",
      label: "Reviewer IDs",
      description: "Identity GUIDs to add as reviewers. Run the **List Users** action first to obtain valid values.",
      optional: true,
    },
    workItemIds: {
      type: "string[]",
      label: "Work Item IDs",
      description: "Numeric IDs of work items to link to the pull request, e.g. `297`. Run the **Query Work Items (WIQL)** action first to obtain valid values.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.createPullRequest({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
      data: {
        sourceRefName: this.sourceRefName,
        targetRefName: this.targetRefName,
        title: this.title,
        description: this.description,
        isDraft: this.isDraft,
        reviewers: this.reviewerIds?.map((id) => ({
          id,
        })),
        workItemRefs: this.workItemIds?.map((id) => ({
          id,
        })),
      },
    });
    $.export("$summary", `Created pull request ${response.pullRequestId}: ${response.title}`);
    return response;
  },
};
