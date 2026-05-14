import gitlab from "../../gitlab.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "gitlab-list-groups",
  name: "List Groups",
  description: "List all groups. [See the documentation](https://docs.gitlab.com/api/groups/#list-groups)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gitlab,
    minAccessLevel: {
      type: "integer",
      label: "Minimum Access Level",
      description: "Limit to groups where current user has at least the specified access level. Possible values: 5 (Minimal access), 10 (Guest), 15 (Planner), 20 (Reporter), 25 (Security Manager), 30 (Developer), 40 (Maintainer), or 50 (Owner).",
      options: [
        {
          label: "Guest",
          value: 10,
        },
        {
          label: "Planner",
          value: 15,
        },
        {
          label: "Reporter",
          value: 20,
        },
        {
          label: "Security Manager",
          value: 25,
        },
        {
          label: "Developer",
          value: 30,
        },
        {
          label: "Maintainer",
          value: 40,
        },
        {
          label: "Owner",
          value: 50,
        },
      ],
      optional: true,
    },
    topLevelOnly: {
      type: "boolean",
      label: "Top Level Only",
      description: "Limit to top-level groups, excluding all subgroups",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Return the list of authorized groups matching the search criteria. Order By must be undefined or `similarity` when `search` is provided",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Order groups by `name`, `path`, `id`, or `similarity`. Default is `name`. Must be `similarity` when `search` is provided",
      options: [
        "name",
        "path",
        "id",
        "similarity",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order. Default is `asc`. Must be one of: `asc` or `desc`",
      options: [
        "asc",
        "desc",
      ],
      default: "asc",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Limit by groups that are not archived and not marked for deletion",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Limit by groups that are archived",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.search && this.orderBy && this.orderBy !== "similarity") {
      throw new ConfigurationError("Order By must be `similarity` when `search` is provided");
    }

    const response = await this.gitlab.listGroups({
      $,
      params: {
        min_access_level: this.minAccessLevel,
        top_level_only: this.topLevelOnly,
        search: this.search,
        order_by: this.orderBy,
        sort: this.sort,
        archived: this.archived,
        active: this.active,
      },
    });

    $.export("$summary", `Successfully listed ${response.length} group${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
