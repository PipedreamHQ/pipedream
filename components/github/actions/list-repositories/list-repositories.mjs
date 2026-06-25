import github from "../../github.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "github-list-repositories",
  name: "List Repositories",
  description: "List repositories the authenticated user can access, or — when `org` is provided — the repositories of a specific organization. Use this to discover a repo's `owner/repo` name before calling **Get Repository**, **Get Repository Content**, or **List Commits**. To find repos by name, set the `name` substring filter. [See the documentation](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    org: {
      type: "string",
      label: "Organization",
      description: "List repositories for this organization (login, e.g. `PipedreamHQ`) instead of the authenticated user. Get org logins from **Get Current User**. Leave blank to list the user's own repositories.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Case-insensitive substring match on repository name. Example: `api` matches `payments-api` and `internal-api-tools`.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Limit results to repositories with the specified visibility (user repos only — ignored when `org` is set).",
      options: [
        "all",
        "public",
        "private",
      ],
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Limit results to repositories of the specified type. For user repos, do not combine with `visibility`.",
      options: [
        "all",
        "owner",
        "public",
        "private",
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
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of repositories to return. Defaults to `100`.",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.org && this.type && this.visibility) {
      throw new ConfigurationError("`type` cannot be used with `visibility`.");
    }

    // When a name filter forces a full scan, use the max page size to minimize
    // round-trips; maxResults is applied after filtering. Otherwise size the page
    // to maxResults so a single page usually suffices.
    const perPage = this.name
      ? 100
      : Math.min(this.maxResults || 100, 100);
    const endpoint = this.org
      ? `GET /orgs/${this.org}/repos`
      : "GET /user/repos";
    const params = this.org
      ? {
        type: this.type,
        sort: this.sort,
        direction: this.direction,
        per_page: perPage,
      }
      : {
        visibility: this.visibility,
        type: this.type,
        sort: this.sort,
        direction: this.direction,
        per_page: perPage,
      };

    // Stop paginating once we have enough results. When a name filter is set we
    // must walk every page, since a match can appear on any page.
    let repos = [];
    for await (const { data } of this.github._client().paginate.iterator(endpoint, params)) {
      repos.push(...data);
      if (!this.name && this.maxResults && repos.length >= this.maxResults) {
        break;
      }
    }

    if (this.name) {
      const nameLower = this.name.toLowerCase();
      repos = repos.filter((repo) => repo.name.toLowerCase().includes(nameLower));
    }

    if (this.maxResults && repos.length > this.maxResults) {
      repos = repos.slice(0, this.maxResults);
    }

    $.export("$summary", `Successfully listed ${repos.length} repositor${repos.length === 1
      ? "y"
      : "ies"}`);
    return repos;
  },
};
