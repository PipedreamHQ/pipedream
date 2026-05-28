import github from "../../github.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "github-list-repositories",
  name: "List Repositories",
  description: "List repositories that the authenticated user has access to. [See the documentation](https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10#list-repositories-for-the-authenticated-user)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    name: {
      type: "string",
      label: "Name",
      description: "Case-insensitive substring match on repository name. Example: `api` matches `payments-api` and `internal-api-tools`.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Limit results to repositories with the specified visibility",
      options: [
        "all",
        "public",
        "private",
      ],
      optional: true,
    },
    affiliation: {
      type: "string[]",
      label: "Affiliation",
      description: "Limit results to repositories with the specified affiliation",
      options: [
        "owner",
        "collaborator",
        "organization_member",
      ],
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Limit results to repositories of the specified type. Not for use with `visibility` or `affiliation`.",
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
    since: {
      type: "string",
      label: "Since",
      description: "Only show repositories updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Only show repositories updated before the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.type && (this.visibility || this.affiliation)) {
      throw new ConfigurationError("`type` cannot be used with `visibility` or `affiliation`.");
    }

    let response = await this.github._client().paginate("GET /user/repos", {
      visibility: this.visibility,
      affiliation: this.affiliation && this.affiliation.join(","),
      type: this.type,
      sort: this.sort,
      direction: this.direction,
      since: this.since,
      before: this.before,
    });

    if (this.name) {
      const nameLower = this.name.toLowerCase();
      response = response.filter((repo) => repo.name.toLowerCase().includes(nameLower));
    }

    $.export("$summary", `Successfully listed ${response.length} repository${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
