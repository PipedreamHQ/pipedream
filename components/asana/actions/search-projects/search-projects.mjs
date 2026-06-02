import asana from "../../asana.app.mjs";

export default {
  type: "action",
  key: "asana-search-projects",
  version: "0.2.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Search Projects",
  description: "Finds an existing project. [See the documentation](https://developers.asana.com/docs/get-multiple-projects)",
  props: {
    asana,
    name: {
      label: "Name",
      description: "The name to filter projects on.",
      type: "string",
      optional: true,
    },
    workspace: {
      label: "Workspace",
      description: "The workspace or organization to filter projects on.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    archived: {
      label: "Archived",
      description: "Only return projects whose `archived` field takes on the value of this parameter.",
      type: "boolean",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    let hasMore, count = 0;
    const params = {
      workspace: this.workspace,
      archived: this.archived,
      limit: Math.min(this.maxResults, 100),
    };
    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getProjects({
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (data.length === 0) break;

      for (const project of data) {
        if (this.name && !project.name.includes(this.name)) continue;
        results.push(project);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", "Successfully retrieved projects");
    return results;
  },
};
