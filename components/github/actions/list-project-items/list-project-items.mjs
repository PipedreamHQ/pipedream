import github from "../../github.app.mjs";

export default {
  key: "github-list-project-items",
  name: "List Project Items",
  description: "List the items in a Project (V2), returning each item's id, type, and title. Use the returned item id with **Update Project (V2) Item Status** to change an item's status. Get the project number from **List Projects** and its valid statuses from **List Project Statuses**. Discover organization logins with **List Organizations**. [See the documentation](https://docs.github.com/en/graphql/reference/projects#object-projectv2item)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    owner: {
      propDefinition: [
        github,
        "projectOwnerStatic",
      ],
    },
    repo: {
      propDefinition: [
        github,
        "projectRepoStatic",
      ],
    },
    project: {
      propDefinition: [
        github,
        "projectNumberStatic",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of items to return. Defaults: `100`",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      github, owner: repoOwner, repo: repoName, project, maxResults,
    } = this;

    const items = await github.getProjectV2Items({
      repoOwner,
      repoName,
      project,
      amount: maxResults,
    }) ?? [];

    $.export("$summary", `Found ${items.length} item(s) in project #${project}`);

    return items;
  },
};
