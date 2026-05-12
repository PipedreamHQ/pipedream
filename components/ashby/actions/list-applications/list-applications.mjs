import app from "../../ashby.app.mjs";

export default {
  key: "ashby-list-applications",
  name: "List Applications",
  description: "Retrieves a list of applications within an organization. [See the documentation](https://developers.ashbyhq.com/reference/applicationlist)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Array of fields to expand in the response",
      optional: true,
      options: [
        "openings",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by application status",
      optional: true,
      options: [
        "Hired",
        "Archived",
        "Active",
        "Lead",
      ],
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      description: "Filter by job ID to get applications for a specific job",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Filter for applications created after this date and time (e.g., `2024-01-01T00:00:00Z`)",
      optional: true,
    },
    syncToken: {
      type: "string",
      label: "Sync Token",
      description: "Token for syncing changes since the last request",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      expand,
      status,
      jobId,
      createdAfter,
      syncToken,
      maxResults,
    } = this;

    const response = await app.paginate({
      fn: app.listApplications,
      fnArgs: {
        $,
        data: {
          expand,
          status,
          jobId,
          syncToken,
          createdAfter: createdAfter
            ? new Date(createdAfter).getTime()
            : undefined,
        },
      },
      keyField: "results",
      max: maxResults,
    });

    $.export("$summary", `Successfully retrieved \`${response.length}\` application(s)`);

    return response;
  },
};
