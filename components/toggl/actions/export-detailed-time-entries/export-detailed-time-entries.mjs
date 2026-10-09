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
      type: "string",
      label: "Date Preset",
      description: "Optional date range resolved using the connected user's Toggl timezone and first day of week. For all-user reports, Toggl evaluates dates in each time entry creator's profile timezone.",
      options: [
        {
          label: "Last Week",
          value: "last_week",
        },
        {
          label: "Last Month",
          value: "last_month",
        },
        {
          label: "This Week",
          value: "this_week",
        },
      ],
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Inclusive report start date in `YYYY-MM-DD` format. Required with End Date when Date Preset is not used.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Inclusive report end date in `YYYY-MM-DD` format. It may be the same as Start Date.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Preset Timezone",
      description: "Optional IANA timezone used to resolve Date Preset. Defaults to the connected user's Toggl profile timezone.",
      optional: true,
    },
    userIds: {
      type: "integer[]",
      label: "User IDs",
      description: "Include only these workspace user IDs. Use **List Workspace Users** to find IDs.",
      optional: true,
    },
    userName: {
      type: "string",
      label: "User Name or Email",
      description: "Optional full or partial name or email. It must resolve to exactly one accessible workspace user.",
      optional: true,
    },
    projectIds: {
      type: "integer[]",
      label: "Project IDs",
      description: "Include only these project IDs.",
      optional: true,
    },
    clientIds: {
      type: "integer[]",
      label: "Client IDs",
      description: "Include only these client IDs.",
      optional: true,
    },
    taskIds: {
      type: "integer[]",
      label: "Task IDs",
      description: "Include only these task IDs.",
      optional: true,
    },
    tagIds: {
      type: "integer[]",
      label: "Tag IDs",
      description: "Include only entries with these tag IDs.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description Filter",
      description: "Include entries whose description matches this value.",
      optional: true,
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Filter entries by billable status. This filter requires the corresponding Toggl feature.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field used to order the exported rows.",
      options: [
        "date",
        "user",
        "duration",
        "description",
        "last_update",
      ],
      default: "date",
    },
    orderDirection: {
      type: "string",
      label: "Order Direction",
      description: "Direction used to order the exported rows.",
      options: [
        "ASC",
        "DESC",
      ],
      default: "ASC",
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
