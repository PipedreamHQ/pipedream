import github from "../../github.app.mjs";

export default {
  key: "github-update-project-v2-item-status",
  name: "Update Project (V2) Item Status",
  description: "Update the status of an item in the selected Project (V2). [See the documentation](https://docs.github.com/en/graphql/reference/mutations#updateprojectv2itemfieldvalue)",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    org: {
      propDefinition: [
        github,
        "orgName",
      ],
    },
    repo: {
      propDefinition: [
        github,
        "repoOrg",
        ({ org }) => ({
          org,
        }),
      ],
      optional: true,
    },
    project: {
      propDefinition: [
        github,
        "projectV2",
        ({
          org, repo,
        }) => ({
          org,
          repo,
        }),
      ],
    },
    item: {
      propDefinition: [
        github,
        "projectItem",
        ({
          org, repo, project,
        }) => ({
          org,
          repo,
          project,
        }),
      ],
    },
    status: {
      propDefinition: [
        github,
        "status",
        ({
          org, repo, project,
        }) => ({
          org,
          repo,
          project,
        }),
      ],
      type: "string",
      description: "The status to set for the item",
    },
    moveToTop: {
      type: "boolean",
      label: "Move to Top",
      description: "If true, moves the item to the top of the column instead of the bottom.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      github, org: repoOwner, repo: repoName, project, item, status,
    } = this;
    const { id: fieldId } = await github.getProjectV2StatusField({
      repoOwner,
      repoName,
      project,
    });

    const projectId = await github.getProjectV2Id({
      repoOwner,
      repoName,
      project,
    });

    const response = await github.updateProjectV2ItemStatus({
      projectId,
      itemId: item,
      fieldId,
      value: {
        singleSelectOptionId: status,
      },
    });

    if (this.moveToTop) {
      await github.updateProjectV2ItemPosition({
        projectId,
        itemId: item,
      });
    }

    $.export("$summary", "Successfully updated item");
    return response.updateProjectV2ItemFieldValue?.projectV2Item;
  },
};
