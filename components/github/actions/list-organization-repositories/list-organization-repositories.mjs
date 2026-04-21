import github from "../../github.app.mjs";

export default {
  key: "github-list-organization-repositories",
  name: "List Organization Repositories",
  description: "List repositories for an organization. [See the documentation](https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10#list-organization-repositories)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    github,
    org: {
      propDefinition: [
        github,
        "orgName",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Limit results to repositories of the specified type",
      options: [
        "all",
        "public",
        "private",
        "forks",
        "sources",
        "member",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the results by",
      options: [
        "created",
        "updated",
        "pushed",
        "full_name",
      ],
      optional: true,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "The direction to sort the results by",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const repositories = await this.github.getOrgRepos({
      org: this.org,
      type: this.type,
      sort: this.sort,
      direction: this.direction,
    });

    $.export("$summary", `Successfully listed ${repositories.length} repositor${repositories.length === 1
      ? "y"
      : "ies"}`);

    return repositories;
  },
};
