import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-search-branches",
  name: "Search Branches",
  description: "Finds branches by name, ID, or active status. [See the documentation](https://developers.rydoo.com/reference/v2branchgetbranches)",
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
      description: "Filter branches where the name or ID contains this string",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Filter by active branches (`true`) or inactive branches (`false`). Defaults to all branches",
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
      description: "The number of branches to return per page (defaults to `50`)",
      optional: true,
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of branches to skip for paging (defaults to `0`)",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.listBranches({
      $,
      params: {
        search: this.search,
        isActive: this.isActive,
        sort: this.sort,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const branches = response?.data || response;
    const count = Array.isArray(branches)
      ? branches.length
      : 0;
    $.export("$summary", `Successfully found ${count} branch${count === 1
      ? ""
      : "es"}.`);

    return response;
  },
};
