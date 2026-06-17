import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-search-projects",
  name: "Search Projects",
  description: "Finds active projects by name or reference ID. [See the documentation](https://developers.rydoo.com/reference/v2projectsgetprojects)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rydoo,
    search: {
      type: "string",
      label: "Search",
      description: "Filter projects where the name contains this string",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Filter by active projects (`true`) or inactive projects (`false`). Defaults to all projects",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the results by",
      optional: true,
      options: [
        "name",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of projects to return per page (defaults to `50`)",
      optional: true,
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of projects to skip for paging (defaults to `0`)",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.listProjects({
      $,
      params: {
        search: this.search,
        isActive: this.isActive,
        sort: this.sort,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const projects = response?.data || response;
    const count = Array.isArray(projects)
      ? projects.length
      : 0;
    $.export("$summary", `Successfully found ${count} project${count === 1
      ? ""
      : "s"}.`);

    return response;
  },
};
