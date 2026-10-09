import toggl from "../../toggl.app.mjs";
import {
  resolveDateRange,
  resolveWorkspaceUser,
} from "../../common/utils.mjs";

export default {
  key: "toggl-export-detailed-time-entries",
  name: "Export Detailed Time Entries",
  description: "Export a complete Toggl Track detailed report as CSV in one request. Use this for monthly or other large reports that may exceed the execution time of paginated JSON searches. The CSV contains only records visible to the connected user. CSV export may require a paid Toggl Track plan. [See the documentation](https://engineering.toggl.com/docs/track/reports/detailed_reports/)",
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
    orderBy: {
      propDefinition: [
        toggl,
        "reportOrderBy",
      ],
    },
    orderDirection: {
      propDefinition: [
        toggl,
        "reportOrderDirection",
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

    const response = await this.toggl.exportDetailedTimeEntriesCsv({
      workspaceId: this.workspaceId,
      data: {
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
        order_by: this.orderBy,
        order_dir: this.orderDirection,
        duration_format: "improved",
        rounding: 0,
        rounding_minutes: 0,
      },
      $,
    });
    const csv = response?.data;

    if (typeof csv !== "string" || !csv.trim()) {
      throw new Error("Toggl returned an invalid or empty detailed report CSV export.");
    }

    const result = {
      format: "csv",
      complete: true,
      dateRange,
      csv,
      characterCount: csv.length,
      ...resolvedUser && {
        resolvedUser,
      },
    };

    $.export("$summary", `Exported a complete detailed report (${result.characterCount} characters)`);

    return result;
  },
};
