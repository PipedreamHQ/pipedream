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
  "username",
  "start",
  "stop",
  "seconds",
  "task_id",
  "billable",
];
const NESTED_TIME_ENTRY_FIELDS = new Set([
  "id",
  "start",
  "stop",
  "seconds",
  "at",
]);
const ENRICHED_FIELDS = [
  "username",
  "email",
  "project_name",
  "task_name",
  "tag_names",
];
// Toggl's summary endpoint groups by projects, users, clients or tags only. Per-task totals
// come from grouping by the project and sub-grouping by tasks.
const SUMMARY_GROUPINGS = {
  users: {
    grouping: "users",
    sub_grouping: "tasks",
  },
  tasks: {
    grouping: "projects",
    sub_grouping: "tasks",
  },
};

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
  key: "toggl-get-project-activity",
  name: "Get Project Activity",
  description: "Report on the time tracked against one Toggl Track project, either as a grouped summary (`view` = `summary`, total seconds per user or per task) or as the individual detailed time entries (`view` = `entries`). Use it for project-level questions such as who logged time on a project last week, how much each task has used, or pulling every entry in a date range. Use **List Workspace Projects** first to get the project ID, and **List Workspace Users** or **List Project Tasks** to turn the user and task IDs in a summary into names. For workspace-wide detailed entries use **Search Detailed Time Entries** instead, and for workspace-wide roll-ups by user, client or project use **Get Time Entry Summary**. A date range is required: either a Date Preset or both Start Date and End Date. In `entries` view it follows Toggl's cursors until Maximum Results is reached (it may return up to one page more than that), and `complete` = true means Toggl has no more entries after this response (when you passed a Cursor, it covers only the entries from that cursor on, so add up the pages); while `complete` = false, pass `nextCursor` back as Cursor to continue. Returns `dateRange` (start and end as queried; its `timezone` is set only when a Date Preset was used, otherwise null; entry times are shown in the Toggl account's timezone), Toggl-computed `totals` and `providerTotals`, plus `report` (summary) or `timeEntries` with `returned`, `hasMore`, `capHit` and `nextCursor` (entries). Example: projectId=123456789, view=\"summary\", grouping=\"users\", datePreset=\"last_week\" → per-user tracked seconds for the project last week. [See the documentation](https://engineering.toggl.com/docs/reports/summary_reports/)",
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
    projectId: {
      propDefinition: [
        toggl,
        "projectId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    view: {
      type: "string",
      label: "View",
      description: "`summary` returns grouped totals; `entries` returns the individual time entries, e.g. `summary`.",
      options: [
        {
          label: "Summary (grouped totals)",
          value: "summary",
        },
        {
          label: "Entries (detailed time entries)",
          value: "entries",
        },
      ],
      default: "summary",
    },
    grouping: {
      type: "string",
      label: "Group By",
      description: "Summary view only: `users` gives each user's seconds per task, `tasks` gives seconds per task across all users, e.g. `users`. Ignored in entries view.",
      options: [
        {
          label: "User",
          value: "users",
        },
        {
          label: "Task",
          value: "tasks",
        },
      ],
      default: "users",
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
    },
    userName: {
      propDefinition: [
        toggl,
        "reportUserName",
      ],
    },
    taskIds: {
      propDefinition: [
        toggl,
        "reportTaskIds",
      ],
      description: "Include only these task IDs of the project, e.g. `[12345678]`. Use **List Project Tasks** to find them.",
    },
    tagIds: {
      propDefinition: [
        toggl,
        "reportTagIds",
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
      description: "Entries view only: rows requested from Toggl per API call, 2 to 50, e.g. `50`. Toggl does not return a continuation cursor for single-row pages, so 1 is not allowed.",
      min: 2,
      max: 50,
      default: 50,
    },
    maxResults: {
      type: "integer",
      label: "Maximum Results",
      description: "Entries view only: rows after which paging stops, e.g. `1000`. The last page may take the total up to one page past it. If reached before Toggl is exhausted, `capHit` and `hasMore` are true.",
      min: 1,
      max: 10000,
      default: 1000,
    },
    cursor: {
      type: "object",
      label: "Cursor",
      description: "Entries view only: the `nextCursor` object returned by a previous run, to continue where it stopped, e.g. `{\"firstRowNumber\": 51}`; only `firstRowNumber` is used for paging. Use the same filters and ordering as that run.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Entries view only: fields to return per entry, e.g. `[\"user_id\", \"seconds\"]`. The slim default omits descriptions. Select All Fields for the complete API rows.",
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
      description: "Entries view only: field used to order entries, e.g. `date`. Date ordering is recommended for repeatable pulls.",
    },
    orderDirection: {
      propDefinition: [
        toggl,
        "reportOrderDirection",
      ],
      description: "Entries view only: ordering direction, e.g. `ASC`.",
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
    const initialCursor = parseCursorInput(this.cursor);

    if (this.view === "entries" && (!Number.isInteger(this.pageSize) || this.pageSize < 2)) {
      throw new ConfigurationError("Page Size must be an integer from 2 to 50: Toggl returns no continuation cursor for single-row pages.");
    }

    if (this.view === "summary" && initialCursor) {
      throw new ConfigurationError("Cursor only applies to the entries view.");
    }

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

    const filters = {
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
      project_ids: [
        this.projectId,
      ],
      user_ids: userIds.size
        ? [
          ...userIds,
        ]
        : undefined,
      task_ids: this.taskIds,
      tag_ids: this.tagIds,
      billable: this.billable,
      rounding: 0,
      rounding_minutes: 0,
    };
    const common = {
      view: this.view,
      projectId: this.projectId,
      dateRange,
      ...resolvedUser && {
        resolvedUser,
      },
    };

    if (this.view === "summary") {
      const summaryResponse = await this.toggl.searchSummaryTimeEntries({
        workspaceId: this.workspaceId,
        data: {
          ...filters,
          ...SUMMARY_GROUPINGS[this.grouping],
        },
        $,
      });

      if (!summaryResponse?.data || typeof summaryResponse.data !== "object") {
        throw new Error("Toggl returned an invalid summary report response.");
      }

      await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS));

      const totalsResponse = await this.toggl.getDetailedTimeEntryTotals({
        workspaceId: this.workspaceId,
        data: filters,
        $,
      });
      const providerTotals = parseProviderTotals(totalsResponse?.data);

      $.export("$summary", `Retrieved project ${this.projectId} summary grouped by ${this.grouping}`);

      return {
        ...common,
        grouping: this.grouping,
        report: summaryResponse.data,
        providerTotals: totalsResponse.data,
        totals: providerTotals,
      };
    }

    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const needsEnrichment = fields.includes(ALL_FIELDS)
      || fields.some((field) => ENRICHED_FIELDS.includes(field));
    const data = {
      ...filters,
      order_by: this.orderBy,
      order_dir: this.orderDirection,
      enrich_response: needsEnrichment,
      grouped: false,
      // first_id is deliberately never sent: Toggl treats it as an exclusive id filter, which
      // skips backdated entries (lower id, later position). first_row_number alone pages correctly.
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
      data.page_size = this.pageSize;

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
      data.first_row_number = apiCursor.firstRowNumber;

      if (timeEntries.length < this.maxResults) {
        await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS));
      }
    } while (timeEntries.length < this.maxResults);

    const hasMore = Boolean(nextCursor);
    const capHit = hasMore && timeEntries.length >= this.maxResults;
    const complete = !hasMore;
    const countsExact = complete && !initialCursor;
    const incompleteReasons = [
      capHit && "result_cap",
    ].filter(Boolean);

    await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS));

    const totalsResponse = await this.toggl.getDetailedTimeEntryTotals({
      workspaceId: this.workspaceId,
      data: filters,
      $,
    });
    const providerTotals = parseProviderTotals(totalsResponse?.data);

    $.export("$summary", `Retrieved ${timeEntries.length} time ${timeEntries.length === 1
      ? "entry"
      : "entries"} for project ${this.projectId}${complete
      ? ""
      : " (incomplete; continue with nextCursor)"}`);

    return {
      ...common,
      timeEntries,
      returned: timeEntries.length,
      returnedCount: timeEntries.length,
      totalCount: countsExact
        ? timeEntries.length
        : null,
      totalCountExact: countsExact,
      complete,
      incompleteReasons,
      hasMore,
      capHit,
      nextCursor,
      totals: {
        ...providerTotals,
        entryCount: countsExact
          ? timeEntries.length
          : null,
        entryCountExact: countsExact,
        scope: "full_filter",
      },
      ...quotaRemaining !== undefined && {
        quota: {
          remaining: Number(quotaRemaining),
          resetsInSeconds: Number(quotaResetsIn),
        },
      },
    };
  },
};
