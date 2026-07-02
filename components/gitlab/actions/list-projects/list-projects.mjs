import gitlab from "../../gitlab.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "gitlab-list-projects",
  name: "List Projects",
  description: "List or search GitLab projects, optionally filtering by search term, membership, or ownership. Use this to discover projects (and their IDs) before acting on them with other GitLab actions. Supports ordering by `name`, `path`, creation/update time, star count, last activity, or search `similarity`, plus pagination. The `similarity` order requires a `Search` term. [See the documentation](https://docs.gitlab.com/api/projects/#list-all-projects)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gitlab,
    search: {
      type: "string",
      label: "Search",
      description: "Return the list of projects with a path, name, or description matching the search criteria (case-insensitive, substring match)",
      optional: true,
    },
    membership: {
      type: "boolean",
      label: "Membership",
      description: "Limit by projects that the current user is a member of",
      optional: true,
    },
    owned: {
      type: "boolean",
      label: "Owned",
      description: "Limit by projects explicitly owned by the current user",
      optional: true,
    },
    simple: {
      type: "boolean",
      label: "Simple",
      description: "Return only limited fields for each project",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Order projects by the given field. Default is `created_at`. Must be `similarity` only when `Search` is provided",
      options: [
        "id",
        "name",
        "path",
        "created_at",
        "updated_at",
        "star_count",
        "last_activity_at",
        "similarity",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order. Default is `desc`. Must be one of: `asc` or `desc`",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of projects to return per page (max 100)",
      min: 1,
      max: 100,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.orderBy === "similarity" && !this.search) {
      throw new ConfigurationError("Order By can be `similarity` only when `Search` is provided");
    }

    const response = await this.gitlab.listProjects({
      $,
      params: {
        search: this.search,
        membership: this.membership,
        owned: this.owned,
        simple: this.simple,
        order_by: this.orderBy,
        sort: this.sort,
        per_page: this.perPage,
        page: this.page,
      },
    });

    $.export("$summary", `Successfully listed ${response.length} project${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
