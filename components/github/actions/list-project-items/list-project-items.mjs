import github from "../../github.app.mjs";

export default {
  key: "github-list-project-items",
  name: "List Project Items",
  description: "List the items in a Project (V2). Each item has an `id`, a `type`, and its title under `fieldValueByName.text` (not a flat `title` field). Use the returned item `id` with **Update Project (V2) Item Status** to change an item's status. Get the project number from **List Projects** and its valid statuses from **List Project Statuses**. Discover organization logins with **List Organizations**. Returns at most 100 items with no pagination — a project with more than 100 items exposes only the last 100 (the tail of the item connection, in the connection's own order), so earlier items can't be retrieved. [See the documentation](https://docs.github.com/en/graphql/reference/projects#object-projectv2item)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
      propDefinition: [
        github,
        "maxResults",
      ],
      description: "The maximum number of items to return. GitHub caps this at `100` per request. Defaults: `100`",
      max: 100,
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
      // Fall back to 100 when unset, then cap: GitHub GraphQL connections
      // reject last/first > 100, and an undefined value would yield NaN.
      amount: Math.min(maxResults ?? 100, 100),
    }) ?? [];

    $.export("$summary", `Found ${items.length} item(s) in project #${project}`);

    return items;
  },
};
