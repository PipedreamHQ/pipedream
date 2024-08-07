import github from "../../github.app.mjs";

export default {
  key: "github-update-project-v2-item-status",
  name: "Update Project (V2) Item Status",
  description: "Update the status of an item in the selected Project (V2). [See the documentation](https://docs.github.com/en/graphql/reference/mutations#updateprojectv2itemfieldvalue)",
  version: "0.0.1",
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
      description: "The status to set for the item",
    },
  },
  async run({ $ }) {

    $.export("$summary", "Successfully updated item");

    // return response;
  },
};
