import app from "../../linearb.app.mjs";

export default {
  key: "linearb-search-incidents",
  name: "Search Incidents",
  description: "Search for incidents within the LinearB platform. [See the documentation](https://docs.linearb.io/api-incidents/#search-incidents)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    teams: {
      propDefinition: [
        app,
        "teams",
      ],
      optional: true,
    },
    services: {
      propDefinition: [
        app,
        "services",
      ],
      optional: true,
    },
    repositoryUrls: {
      type: "string[]",
      label: "Repository URLs",
      description: "The list of repos urls related to this incident. **Lowercase only**",
      optional: true,
    },
    issuedAtBefore: {
      type: "string",
      label: "Issued At Before",
      description: "The specific date when the incident was logged and officially opened. (Format: `YYYY-MM-DD`)",
      optional: true,
    },
    issuedAtAfter: {
      type: "string",
      label: "Issued At After",
      description: "The specific date when the incident was logged and officially opened. (Format: `YYYY-MM-DD`)",
      optional: true,
    },
    startedAt: {
      type: "string",
      label: "Started At",
      description: "The specific date when work on the incident commenced. (Format: `YYYY-MM-DD`)",
      optional: true,
    },
    endedAt: {
      type: "string",
      label: "Ended At",
      description: "The specific date when the incident was successfully resolved. (Format: `YYYY-MM-DD`)",
      optional: true,
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "A list of statuses of the incident",
      options: [
        "open",
        "in-progress",
        "closed",
        "deleted",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.paginate({
      $,
      resourceFn: this.app.getIncidents,
      resourceName: "items",
      resourceFnArgs: {
        data: {
          issued_at: {
            before: this.issuedAtBefore,
            after: this.issuedAtAfter,
          },
          started_at: this.startedAt,
          ended_at: this.endedAt,
          statuses: this.statuses,
          teams: this.teams,
          services: this.services,
          repository_urls: this.repositoryUrls,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully searched ${response.length} incident${response.length > 1
      ? "s"
      : ""}`);
    return response;
  },
};
