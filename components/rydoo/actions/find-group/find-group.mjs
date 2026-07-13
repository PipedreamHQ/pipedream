import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-find-group",
  name: "Find Group",
  description: "Searches for organizational groups by name to find their UUIDs. [See the documentation](https://developers.rydoo.com/reference/v2groupsgetgroups)",
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
      description: "Filter groups where the name contains this string",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Filter by active status (`true` for active groups only, `false` for inactive)",
      optional: true,
    },
    parentGroupId: {
      propDefinition: [
        rydoo,
        "parentGroupId",
      ],
      optional: true,
    },
    branchId: {
      propDefinition: [
        rydoo,
        "branchId",
      ],
      optional: true,
    },
    branchIds: {
      propDefinition: [
        rydoo,
        "branchIds",
      ],
      optional: true,
    },
    loadAllLevels: {
      type: "boolean",
      label: "Load All Levels",
      description: "When set to `true`, returns all nested group levels instead of only the top level",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the results by (e.g., `name`)",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of groups to return per page (defaults to `50`)",
      optional: true,
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of groups to skip for paging (defaults to `0`)",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.listGroups({
      $,
      params: {
        search: this.search,
        isActive: this.isActive,
        parentGroupId: this.parentGroupId,
        branchId: this.branchId,
        branchIds: this.branchIds,
        loadAllLevels: this.loadAllLevels,
        sort: this.sort,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const groups = response?.data || response;
    const count = Array.isArray(groups)
      ? groups.length
      : 0;
    $.export("$summary", `Successfully found ${count} group${count === 1
      ? ""
      : "s"}.`);

    return response;
  },
};
