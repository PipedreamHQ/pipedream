import toggl from "../../toggl.app.mjs";
import {
  parseProviderTotals,
  resolveDateRange,
  resolveWorkspaceUser,
  unwrapItems,
} from "../../common/utils.mjs";
import { compactSummaryReport } from "../../common/report-utils.mjs";

const REQUEST_INTERVAL_MS = 1000;

export default {
  key: "toggl-get-time-entry-summary",
  name: "Get Time Entry Summary",
  description: "Return compact Toggl-computed summary groups and totals by user, client, or project. The action validates that every returned group reconciles with the provider totals and omits the large nested provider payload. Results are limited by the connected user's Toggl permissions. [See the documentation](https://engineering.toggl.com/docs/track/reports/summary_reports/)",
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
    let workspaceUsers;
    let resolvedUser = null;

    if (this.userName) {
      workspaceUsers = await this.toggl.getWorkspaceUsers({
        workspaceId: this.workspaceId,
        $,
      });

      if (!Array.isArray(workspaceUsers)) {
        throw new Error("Toggl returned an invalid workspace users response.");
      }

      resolvedUser = resolveWorkspaceUser(workspaceUsers, this.userName);
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

    const compactReport = compactSummaryReport(summaryResponse.data);
    let groupEntities;

    if (this.grouping === "users") {
      groupEntities = workspaceUsers || await this.toggl.getWorkspaceUsers({
        workspaceId: this.workspaceId,
        $,
      });
    } else if (this.grouping === "clients") {
      const clientsResponse = await this.toggl.getClients({
        workspaceId: this.workspaceId,
        params: {
          status: "both",
        },
        $,
      });
      groupEntities = unwrapItems(clientsResponse, "workspace clients");
    } else {
      const projectsResponse = await this.toggl.getProjects({
        workspaceId: this.workspaceId,
        params: {
          active: "both",
        },
        $,
      });
      groupEntities = unwrapItems(projectsResponse, "workspace projects");
    }

    if (!Array.isArray(groupEntities)) {
      throw new Error(`Toggl returned invalid ${this.grouping} metadata for the summary groups.`);
    }

    const entitiesById = new Map(groupEntities.map((entity) => [
      Number(entity.id),
      entity,
    ]));
    const groups = compactReport.groups.map((group) => {
      const entity = entitiesById.get(Number(group.id));
      const name = group.name || entity?.fullname || entity?.name || null;

      return {
        ...group,
        name,
        ...this.grouping === "users" && entity?.email && {
          email: entity.email,
        },
      };
    });

    await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS));

    const totalsResponse = await this.toggl.getDetailedTimeEntryTotals({
      workspaceId: this.workspaceId,
      data: filters,
      $,
    });

    if (!totalsResponse?.data || typeof totalsResponse.data !== "object") {
      throw new Error("Toggl returned an invalid report totals response.");
    }

    const providerTotals = parseProviderTotals(totalsResponse.data);
    const groupedTotals = groups.reduce((totals, group) => ({
      trackedSeconds: totals.trackedSeconds + group.trackedSeconds,
      billableSeconds: totals.billableSeconds + group.billableSeconds,
      entryCount: totals.entryCount + group.entryCount,
    }), {
      trackedSeconds: 0,
      billableSeconds: 0,
      entryCount: 0,
    });

    if (
      groupedTotals.trackedSeconds !== providerTotals.trackedSeconds
      || groupedTotals.billableSeconds !== providerTotals.billableSeconds
      || groupedTotals.entryCount !== compactReport.entryCount
    ) {
      throw new Error(`Summary groups did not reconcile with Toggl totals. Groups: ${groupedTotals.trackedSeconds} tracked / ${groupedTotals.billableSeconds} billable seconds / ${groupedTotals.entryCount} entries; totals: ${providerTotals.trackedSeconds} tracked / ${providerTotals.billableSeconds} billable seconds / ${compactReport.entryCount} unique entries.`);
    }

    const totals = {
      ...providerTotals,
      entryCount: compactReport.entryCount,
      entryCountExact: true,
    };
    const result = {
      grouping: this.grouping,
      dateRange,
      groups,
      groupCount: compactReport.groupCount,
      totals,
      complete: true,
      totalsMatchGroups: true,
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
