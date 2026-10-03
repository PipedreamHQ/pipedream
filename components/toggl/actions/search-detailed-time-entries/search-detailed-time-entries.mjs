import { ConfigurationError } from "@pipedream/platform";
import toggl from "../../toggl.app.mjs";
import {
  getNextCursor,
  parseDate,
} from "../../common/utils.mjs";

const PAGE_SIZE = 50;
const REQUEST_INTERVAL_MS = 1000;

export default {
  key: "toggl-search-detailed-time-entries",
  name: "Search Detailed Time Entries",
  description: "Search time entries across a Toggl Track workspace. Toggl limits results to entries the connected user is permitted to view, including access granted by workspace, project, or organization roles. Returns `timeEntries`, `returned`, `hasMore`, `nextCursor`, and API quota details. When `hasMore` is true, pass the fields from `nextCursor` into a subsequent run to continue. [See the documentation](https://engineering.toggl.com/docs/track/reports/detailed_reports/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    toggl,
    workspaceId: {
      propDefinition: [
        toggl,
        "workspaceId",
      ],
    },
    startDate: {
      propDefinition: [
        toggl,
        "startDate",
      ],
      description: "Inclusive report start date in `YYYY-MM-DD` format, e.g. `2026-09-01`.",
    },
    endDate: {
      propDefinition: [
        toggl,
        "endDate",
      ],
      description: "Inclusive report end date in `YYYY-MM-DD` format, e.g. `2026-09-30`. Must be after `startDate`.",
    },
    userIds: {
      type: "integer[]",
      label: "User IDs",
      description: "Return entries for these user IDs, subject to the connected user's Toggl permissions, e.g. `[1234567, 2345678]`. Run **Search Detailed Time Entries** without this filter and read `user_id` from enriched results to find accessible values.",
      optional: true,
    },
    projectIds: {
      type: "integer[]",
      label: "Project IDs",
      description: "Return entries for these project IDs, e.g. `[123456789]`. Run **Search Detailed Time Entries** without this filter and read `project_id` from enriched results to find accessible values.",
      optional: true,
    },
    clientIds: {
      type: "integer[]",
      label: "Client IDs",
      description: "Return entries for these client IDs, e.g. `[12345678]`. Run **Search Detailed Time Entries** without this filter and read `client_id` from enriched results to find accessible values.",
      optional: true,
    },
    taskIds: {
      type: "integer[]",
      label: "Task IDs",
      description: "Return entries for these task IDs, e.g. `[12345678]`. Run **Search Detailed Time Entries** without this filter and read `task_id` from enriched results to find accessible values.",
      optional: true,
    },
    tagIds: {
      type: "integer[]",
      label: "Tag IDs",
      description: "Return entries with these tag IDs, e.g. `[1234567]`. Run **Search Detailed Time Entries** without this filter and read tag IDs from enriched results to find accessible values.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Return entries whose description matches this value, e.g. `weekly planning`.",
      optional: true,
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Filter entries by billable status, e.g. `true` for billable entries. This filter requires a paid Toggl feature.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field used to order the results, e.g. `date`.",
      options: [
        {
          label: "Date",
          value: "date",
        },
        {
          label: "User",
          value: "user",
        },
        {
          label: "Duration",
          value: "duration",
        },
        {
          label: "Description",
          value: "description",
        },
        {
          label: "Last Update",
          value: "last_update",
        },
      ],
      default: "date",
    },
    orderDirection: {
      type: "string",
      label: "Order Direction",
      description: "Direction used to order the results, e.g. `DESC`.",
      options: [
        {
          label: "Ascending",
          value: "ASC",
        },
        {
          label: "Descending",
          value: "DESC",
        },
      ],
      default: "DESC",
    },
    enrichResponse: {
      type: "boolean",
      label: "Enrich Response",
      description: "Include the maximum available user, project, client, task, and tag information, e.g. `true`.",
      default: true,
    },
    maxResults: {
      type: "integer",
      label: "Maximum Results",
      description: "Maximum number of entries to return, e.g. `200`. The action retrieves up to 50 entries per Toggl request and follows cursors until this limit is reached.",
      min: 1,
      max: 1000,
      default: 200,
    },
    firstId: {
      type: "integer",
      label: "First ID",
      description: "The `nextCursor.firstId` value returned by a previous **Search Detailed Time Entries** run, e.g. `1234567890`. Pass it together with `firstRowNumber` when present.",
      min: 0,
      optional: true,
    },
    firstRowNumber: {
      type: "integer",
      label: "First Row Number",
      description: "The `nextCursor.firstRowNumber` value returned by a previous **Search Detailed Time Entries** run, e.g. `50`. Pass it with `firstId` when that field is present in the same cursor.",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const startTimestamp = parseDate(this.startDate, "Start Date");
    const endTimestamp = parseDate(this.endDate, "End Date");

    if (startTimestamp >= endTimestamp) {
      throw new ConfigurationError("End Date must be after Start Date.");
    }

    if (this.firstId !== undefined && this.firstRowNumber === undefined) {
      throw new ConfigurationError("First Row Number is required when First ID is provided.");
    }

    const data = {
      start_date: this.startDate,
      end_date: this.endDate,
      user_ids: this.userIds,
      project_ids: this.projectIds,
      client_ids: this.clientIds,
      task_ids: this.taskIds,
      tag_ids: this.tagIds,
      description: this.description,
      billable: this.billable,
      order_by: this.orderBy,
      order_dir: this.orderDirection,
      enrich_response: this.enrichResponse,
      grouped: false,
      first_id: this.firstId,
      first_row_number: this.firstRowNumber,
    };
    const timeEntries = [];
    const seenCursors = new Set();
    let nextCursor = null;
    let quotaRemaining;
    let quotaResetsIn;

    if (this.firstRowNumber !== undefined) {
      seenCursors.add(`${this.firstId ?? ""}:${this.firstRowNumber}`);
    }

    do {
      data.page_size = Math.min(PAGE_SIZE, this.maxResults - timeEntries.length);

      const response = await this.toggl.searchDetailedTimeEntries({
        workspaceId: this.workspaceId,
        data,
        $,
      });
      const page = response.data || [];

      timeEntries.push(...page);
      nextCursor = getNextCursor(response.headers);
      quotaRemaining = response.headers?.["x-toggl-quota-remaining"];
      quotaResetsIn = response.headers?.["x-toggl-quota-resets-in"];

      if (!nextCursor) break;

      const cursorKey = `${nextCursor.firstId ?? ""}:${nextCursor.firstRowNumber}`;

      if (seenCursors.has(cursorKey)) {
        throw new Error("Toggl returned a repeated pagination cursor, so pagination was stopped to prevent duplicate results.");
      }

      seenCursors.add(cursorKey);

      if (!page.length) break;

      if (nextCursor.firstId === undefined) {
        delete data.first_id;
      } else {
        data.first_id = nextCursor.firstId;
      }
      data.first_row_number = nextCursor.firstRowNumber;

      if (timeEntries.length < this.maxResults) {
        await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS));
      }
    } while (timeEntries.length < this.maxResults);

    const hasMore = Boolean(nextCursor);
    const result = {
      timeEntries: timeEntries.slice(0, this.maxResults),
      returned: Math.min(timeEntries.length, this.maxResults),
      hasMore,
      nextCursor,
      ...quotaRemaining !== undefined && {
        quota: {
          remaining: Number(quotaRemaining),
          resetsInSeconds: Number(quotaResetsIn),
        },
      },
    };

    $.export("$summary", `Successfully retrieved ${result.returned} time ${result.returned === 1
      ? "entry"
      : "entries"}`);

    return result;
  },
};
