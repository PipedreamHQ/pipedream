import app from "../../ashby.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ashby-list-applications",
  name: "List Applications",
  description: "Retrieves a list of applications within an organization. [See the documentation](https://developers.ashbyhq.com/reference/applicationlist)",
  version: "1.0.0",
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
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Opaque cursor from a previous response's `nextCursor` to resume pagination mid-stream",
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
      cursor,
      maxResults = constants.LIMIT_MAX,
    } = this;

    const baseData = {
      expand,
      status,
      jobId,
      syncToken,
      createdAfter: createdAfter
        ? new Date(createdAfter).getTime()
        : undefined,
    };

    const accumulated = [];
    let pageCursor = cursor;
    let lastResponse;

    while (accumulated.length < maxResults) {
      const remaining = maxResults - accumulated.length;
      const limit = Math.min(remaining, constants.LIMIT_MAX);

      lastResponse = await app.listApplications({
        $,
        data: {
          ...baseData,
          cursor: pageCursor,
          limit,
        },
      });

      const items = lastResponse.results || [];
      accumulated.push(...items);

      pageCursor = lastResponse.nextCursor;
      if (!pageCursor || !items.length) {
        break;
      }
    }

    const response = {
      success: true,
      results: accumulated,
      moreDataAvailable: lastResponse?.moreDataAvailable,
      ...(lastResponse?.nextCursor && {
        nextCursor: lastResponse.nextCursor,
      }),
      ...(lastResponse?.syncToken && {
        syncToken: lastResponse.syncToken,
      }),
    };

    $.export(
      "$summary",
      `Successfully retrieved \`${accumulated.length}\` application(s)${response.moreDataAvailable
        ? " (more data available)"
        : ""}`,
    );

    return response;
  },
};
