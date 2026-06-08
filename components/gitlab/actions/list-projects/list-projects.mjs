import gitlab from "../../gitlab.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "gitlab-list-projects",
  name: "List Projects",
  description: "List all projects. [See the documentation](https://docs.gitlab.com/api/projects/#list-all-projects)",
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
      description: "Return the list of projects matching the search criteria. Order By must be undefined or `similarity` when `search` is provided",
      optional: true,
    },
    membership: {
      type: "boolean",
      label: "Membership",
      description: "Limit by projects that the current user is a member of.",
      optional: true,
    },
    owned: {
      type: "boolean",
      label: "Owned",
      description: "Limit by projects explicitly owned by the current user.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Order projects by `id`, `name`, `path`, `created_at`, `updated_at`, `last_activity_at`, or `similarity`. Default is `created_at`. Must be `similarity` when `search` is provided",
      options: [
        "id",
        "name",
        "path",
        "created_at",
        "updated_at",
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
    simple: {
      type: "boolean",
      label: "Simple",
      description: "Return only limited fields for each project.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of results to retrieve per page.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.search && this.orderBy && this.orderBy !== "similarity") {
      throw new ConfigurationError("Order By must be `similarity` when `search` is provided");
    }

    const response = await this.gitlab.listProjects({
      $,
      params: {
        search: this.search,
        membership: this.membership,
        owned: this.owned,
        order_by: this.orderBy === "similarity" && !this.search
          ? undefined
          : this.orderBy,
        sort: this.sort,
        simple: this.simple,
        page: this.page,
        per_page: this.perPage,
      },
    });

    $.export("$summary", `Successfully listed ${response.length} project${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
