import toggl from "../../toggl.app.mjs";
import {
  parseProviderTotals,
  resolveDateRange,
  resolveWorkspaceUser,
} from "../../common/utils.mjs";

const REQUEST_INTERVAL_MS = 1000;

const collectTimeEntryIds = (value, ids = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectTimeEntryIds(item, ids));
    return ids;
  }

  if (!value || typeof value !== "object") return ids;

  for (const [
    key,
    nestedValue,
  ] of Object.entries(value)) {
    if ([
      "ids",
      "time_entry_ids",
      "timeEntryIds",
    ].includes(key) && Array.isArray(nestedValue)) {
      nestedValue.forEach((id) => ids.add(id));
    } else {
      collectTimeEntryIds(nestedValue, ids);
    }
  }

  return ids;
};

export default {
  key: "toggl-get-time-entry-summary",
  name: "Get Time Entry Summary",
  description: "Return Toggl-computed summary report groups and totals by user, client, or project. Results are limited by the connected user's Toggl permissions. [See the documentation](https://engineering.toggl.com/docs/track/reports/summary_reports/)",
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
    grouping: {
      type: "string",
      label: "Group By",
      description: "Primary grouping for the Toggl summary report, e.g. `users`.",
      options: [
        {
          label: "User",
          value: "users",
        },
        {
          label: "Client",
          value: "clients",
        },
        {
          label: "Project",
          value: "projects",
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
    billable: {
      propDefinition: [
        toggl,
        "reportBillable",
      ],
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
      user_ids: userIds.size
        ? [
          ...userIds,
        ]
        : undefined,
      project_ids: this.projectIds,
      client_ids: this.clientIds,
      billable: this.billable,
      rounding: 0,
      rounding_minutes: 0,
    };
    const summaryResponse = await this.toggl.searchSummaryTimeEntries({
      workspaceId: this.workspaceId,
      data: {
        ...filters,
        grouping: this.grouping,
        sub_grouping: "time_entries",
        include_time_entry_ids: true,
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

    if (!totalsResponse?.data || typeof totalsResponse.data !== "object") {
      throw new Error("Toggl returned an invalid report totals response.");
    }

    const timeEntryIds = collectTimeEntryIds(summaryResponse.data);
    const totals = {
      ...parseProviderTotals(totalsResponse.data),
      entryCount: timeEntryIds.size,
    };
    const result = {
      grouping: this.grouping,
      dateRange,
      report: summaryResponse.data,
      providerTotals: totalsResponse.data,
      totals,
      ...resolvedUser && {
        resolvedUser,
      },
    };

    $.export("$summary", `Retrieved ${this.grouping} summary for ${totals.entryCount} time ${totals.entryCount === 1
      ? "entry"
      : "entries"}`);

    return result;
  },
};
