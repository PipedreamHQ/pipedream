import { ConfigurationError } from "@pipedream/platform";
import toggl from "../../toggl.app.mjs";
import {
  getNextCursor,
  parseCursorInput,
  parseProviderTotals,
  resolveDateRange,
  resolveWorkspaceUser,
} from "../../common/utils.mjs";

const REQUEST_INTERVAL_MS = 1000;
const ALL_FIELDS = "all_fields";
const DEFAULT_FIELDS = [
  "user_id",
  "start",
  "seconds",
  "client_name",
  "project_id",
  "project_name",
  "billable",
];
const NESTED_TIME_ENTRY_FIELDS = new Set([
  "id",
  "start",
  "stop",
  "seconds",
  "at",
]);

const projectFields = (value, fields) => {
  if (fields.includes(ALL_FIELDS)) return value;

  const projected = {};

  for (const field of fields) {
    if (!NESTED_TIME_ENTRY_FIELDS.has(field) && Object.hasOwn(value, field)) {
      projected[field] = value[field];
    }
  }

  const nestedFields = fields.filter((field) => NESTED_TIME_ENTRY_FIELDS.has(field));

  if (nestedFields.length && Array.isArray(value.time_entries)) {
    projected.time_entries = value.time_entries.map((entry) => Object.fromEntries(
      nestedFields
        .filter((field) => Object.hasOwn(entry, field))
        .map((field) => [
          field,
          entry[field],
        ]),
    ));
  }

  return projected;
};

export default {
  key: "toggl-search-detailed-time-entries",
  name: "Search Detailed Time Entries",
  description: "Search workspace-wide Toggl Track time entries with structured filters and provider-computed totals. Follows Toggl Reports API cursors up to an explicit cap and returns deterministic JSON without model rewriting. Only present the entries as a complete report when `complete` is true; otherwise use **Export Detailed Time Entries**. Results are limited by the connected user's Toggl permissions. [See the documentation](https://engineering.toggl.com/docs/track/reports/detailed_reports/)",
  version: "1.0.0",
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
    datePreset: {
      propDefinition: [
        toggl,
        "reportDatePreset",
      ],
    },
    startDate: {
      propDefinition: [
        toggl,
        "reportStartDate",
      ],
    },
    endDate: {
      propDefinition: [
        toggl,
        "reportEndDate",
      ],
    },
    timezone: {
      propDefinition: [
        toggl,
        "reportTimezone",
      ],
    },
    userIds: {
      propDefinition: [
        toggl,
        "reportUserIds",
      ],
      description: "Return entries for these user IDs, subject to the connected user's Toggl permissions, e.g. `[1234567]`. Use **List Workspace Users** and its `userId` field to find accessible IDs.",
    },
    userName: {
      propDefinition: [
        toggl,
        "reportUserName",
      ],
      description: "Optional full or partial name or email, e.g. `Angus`. It must resolve to exactly one accessible workspace user. The resolved ID is combined with User IDs.",
    },
    projectIds: {
      propDefinition: [
        toggl,
        "reportProjectIds",
      ],
    },
    clientIds: {
      propDefinition: [
        toggl,
        "reportClientIds",
      ],
    },
    taskIds: {
      propDefinition: [
        toggl,
        "reportTaskIds",
      ],
    },
    tagIds: {
      propDefinition: [
        toggl,
        "reportTagIds",
      ],
    },
    description: {
      propDefinition: [
        toggl,
        "reportDescription",
      ],
    },
    billable: {
      propDefinition: [
        toggl,
        "reportBillable",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of rows requested from Toggl per API call, e.g. `50`.",
      min: 1,
      max: 50,
      default: 50,
    },
    maxResults: {
      type: "integer",
      label: "Maximum Results",
      description: "Maximum rows returned across all server-side pages, e.g. `1000`. If reached before Toggl is exhausted, `capHit` and `hasMore` are true and `totalCount` is null.",
      min: 1,
      max: 10000,
      default: 1000,
    },
    cursor: {
      type: "object",
      label: "Cursor",
      description: "Optional `nextCursor` object returned by a previous run, e.g. `{\"firstId\": 123, \"firstRowNumber\": 51}`. Header values are preserved unchanged.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Raw Toggl fields to return, e.g. `[\"user_id\", \"seconds\"]`. The slim default omits descriptions. Select All Fields for the complete API rows.",
      options: [
        {
          label: "User ID",
          value: "user_id",
        },
        {
          label: "User Name",
          value: "username",
        },
        {
          label: "User Email",
          value: "email",
        },
        {
          label: "Time Entry ID",
          value: "id",
        },
        {
          label: "Start / Date",
          value: "start",
        },
        {
          label: "Stop",
          value: "stop",
        },
        {
          label: "Duration in Seconds",
          value: "seconds",
        },
        {
          label: "Client Name",
          value: "client_name",
        },
        {
          label: "Project ID",
          value: "project_id",
        },
        {
          label: "Project Name",
          value: "project_name",
        },
        {
          label: "Billable",
          value: "billable",
        },
        {
          label: "Description",
          value: "description",
        },
        {
          label: "Task ID",
          value: "task_id",
        },
        {
          label: "Task Name",
          value: "task_name",
        },
        {
          label: "Tag IDs",
          value: "tag_ids",
        },
        {
          label: "Tag Names",
          value: "tag_names",
        },
        {
          label: "Last Updated",
          value: "at",
        },
        {
          label: "All Fields",
          value: ALL_FIELDS,
        },
      ],
      default: DEFAULT_FIELDS,
    },
    orderBy: {
      propDefinition: [
        toggl,
        "reportOrderBy",
      ],
      description: "Field used to order results, for example `date`. Date ordering is recommended for repeatable report pulls.",
    },
    orderDirection: {
      propDefinition: [
        toggl,
        "reportOrderDirection",
      ],
    },
    firstId: {
      type: "integer",
      label: "Legacy First ID",
      description: "Deprecated. Prefer Cursor. The `nextCursor.firstId` value from an earlier action version, e.g. `1234567890`.",
      min: 0,
      optional: true,
    },
    firstRowNumber: {
      type: "integer",
      label: "Legacy First Row Number",
      description: "Deprecated. Prefer Cursor. The `nextCursor.firstRowNumber` value from an earlier action version, e.g. `50`.",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    let profile;

    if (this.datePreset) {
      profile = await this.toggl.getMe({
        $,
      });

      if (!profile || typeof profile !== "object") {
        throw new Error("Toggl returned an invalid user profile response.");
      }
    }

    const dateRange = resolveDateRange({
      startDate: this.startDate,
      endDate: this.endDate,
      datePreset: this.datePreset,
      timezone: this.timezone || profile?.timezone || "UTC",
      weekStart: profile?.beginning_of_week ?? 1,
    });

    if (this.cursor && (this.firstId !== undefined || this.firstRowNumber !== undefined)) {
      throw new ConfigurationError("Use Cursor or the legacy cursor fields, not both.");
    }

    const initialCursor = parseCursorInput(this.cursor || (
      this.firstId !== undefined || this.firstRowNumber !== undefined
        ? {
          firstId: this.firstId,
          firstRowNumber: this.firstRowNumber,
        }
        : null
    ));
    const userIds = new Set(this.userIds || []);
    let resolvedUser = null;

    if (this.userName) {
      const users = await this.toggl.getWorkspaceUsers({
        workspaceId: this.workspaceId,
        $,
      });

      if (!Array.isArray(users)) {
        throw new Error("Toggl returned an invalid workspace users response.");
      }

      resolvedUser = resolveWorkspaceUser(users, this.userName);
      userIds.add(resolvedUser.userId);
    }

    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const needsEnrichment = fields.includes(ALL_FIELDS) || fields.some((field) => [
      "username",
      "email",
      "client_name",
      "project_name",
      "task_name",
      "tag_names",
    ].includes(field));
    const filters = {
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
      user_ids: userIds.size
        ? [
          ...userIds,
        ]
        : undefined,
      project_ids: this.projectIds,
      client_ids: this.clientIds,
      task_ids: this.taskIds,
      tag_ids: this.tagIds,
      description: this.description,
      billable: this.billable,
      rounding: 0,
      rounding_minutes: 0,
    };
    const data = {
      ...filters,
      order_by: this.orderBy,
      order_dir: this.orderDirection,
      enrich_response: needsEnrichment,
      grouped: false,
      first_id: initialCursor?.firstId,
      first_row_number: initialCursor?.firstRowNumber,
    };
    const timeEntries = [];
    const seenCursors = new Set();
    let nextCursor = null;
    let quotaRemaining;
    let quotaResetsIn;

    if (initialCursor) {
      seenCursors.add(`${initialCursor.firstId ?? ""}:${initialCursor.firstRowNumber ?? ""}`);
    }

    do {
      data.page_size = Math.min(this.pageSize, this.maxResults - timeEntries.length);

      const response = await this.toggl.searchDetailedTimeEntries({
        workspaceId: this.workspaceId,
        data,
        $,
      });
      const page = response?.data;

      if (!Array.isArray(page)) {
        throw new Error("Toggl returned an invalid detailed report response.");
      }

      nextCursor = getNextCursor(response.headers);

      if (!page.length && nextCursor) {
        throw new Error("Toggl returned an empty report page with a continuation cursor.");
      }

      timeEntries.push(...page.map((entry) => projectFields(entry, fields)));
      quotaRemaining = response.headers?.["x-toggl-quota-remaining"];
      quotaResetsIn = response.headers?.["x-toggl-quota-resets-in"];

      if (!nextCursor) break;

      const cursorKey = `${nextCursor.firstId ?? ""}:${nextCursor.firstRowNumber}`;

      if (seenCursors.has(cursorKey)) {
        throw new Error("Toggl returned a repeated pagination cursor, so the report cannot continue safely.");
      }

      seenCursors.add(cursorKey);

      const apiCursor = parseCursorInput(nextCursor);
      if (apiCursor.firstId === undefined) {
        delete data.first_id;
      } else {
        data.first_id = apiCursor.firstId;
      }
      data.first_row_number = apiCursor.firstRowNumber;

      if (timeEntries.length < this.maxResults) {
        await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS));
      }
    } while (timeEntries.length < this.maxResults);

    const hasMore = Boolean(nextCursor);
    const capHit = hasMore && timeEntries.length >= this.maxResults;
    const complete = !hasMore && !initialCursor;
    const totalCount = complete
      ? timeEntries.length
      : null;
    const incompleteReasons = [
      initialCursor && "initial_cursor",
      capHit && "result_cap",
    ].filter(Boolean);

    await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS));

    const totalsResponse = await this.toggl.getDetailedTimeEntryTotals({
      workspaceId: this.workspaceId,
      data: filters,
      $,
    });
    const providerTotals = parseProviderTotals(totalsResponse?.data);
    const result = {
      timeEntries,
      returned: timeEntries.length,
      returnedCount: timeEntries.length,
      totalCount,
      totalCountExact: complete,
      complete,
      incompleteReasons,
      hasMore,
      capHit,
      nextCursor,
      dateRange,
      totals: {
        ...providerTotals,
        entryCount: complete
          ? timeEntries.length
          : null,
        entryCountExact: complete,
        scope: "full_filter",
      },
      ...resolvedUser && {
        resolvedUser,
      },
      ...quotaRemaining !== undefined && {
        quota: {
          remaining: Number(quotaRemaining),
          resetsInSeconds: Number(quotaResetsIn),
        },
      },
    };

    $.export("$summary", `Successfully retrieved ${result.returnedCount} time ${result.returnedCount === 1
      ? "entry"
      : "entries"}${complete
      ? " with provider-computed totals"
      : " (incomplete; use the export action)"}`);

    return result;
  },
};
