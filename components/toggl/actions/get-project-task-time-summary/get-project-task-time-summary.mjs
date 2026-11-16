import toggl from "../../toggl.app.mjs";
import { resolveDateRange } from "../../common/utils.mjs";

export default {
  key: "toggl-get-project-task-time-summary",
  name: "Get Project Task Time Summary",
  description: "Get how much time was tracked on each task of one Toggl Track project over a date range, with task names, plus the time tracked on the project without a task. Use it when a user asks how much time each task of a project took, e.g. \"how long did each task on Website Redesign take last week?\". Use **List Workspace Projects** first to get the project ID. For per-user or per-project totals use **Get Time Entry Summary**, and for the individual time entries use **Search Detailed Time Entries**; both accept a project filter. A date range is required: either a Date Preset (resolved in the connected user's Toggl timezone and first day of week) or both Start Date and End Date. Returns `dateRange`, `totalSeconds`, `tasks` (each with `taskId`, `taskName` and `seconds`, most time first) and `untaskedSeconds`. Example: workspaceId=1234567, projectId=123456789, datePreset=\"last_week\" → each task's tracked seconds for last week. [See the documentation](https://engineering.toggl.com/docs/track/reports/summary_reports/)",
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
        "workspaceIdStatic",
      ],
    },
    projectId: {
      propDefinition: [
        toggl,
        "projectIdStatic",
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
  },
  async run({ $ }) {
    let profile;
    if (this.datePreset) {
      profile = await this.toggl.getMe({
        $,
      });
    }
    const dateRange = resolveDateRange({
      startDate: this.startDate,
      endDate: this.endDate,
      datePreset: this.datePreset,
      timezone: profile?.timezone || "UTC",
      weekStart: profile?.beginning_of_week ?? 1,
    });

    // Toggl's summary report has no task grouping of its own: group by project and
    // sub-group by task, filtered to this project.
    const [
      summaryResponse,
      projectTasks,
    ] = await Promise.all([
      this.toggl.searchSummaryTimeEntries({
        workspaceId: this.workspaceId,
        data: {
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
          project_ids: [
            this.projectId,
          ],
          grouping: "projects",
          sub_grouping: "tasks",
        },
        $,
      }),
      this.toggl.listProjectTasks({
        workspaceId: this.workspaceId,
        projectId: this.projectId,
        $,
      }),
    ]);

    const group = (summaryResponse?.data?.groups || [])
      .find(({ id }) => id === this.projectId);
    const taskNames = new Map((projectTasks || []).map((task) => [
      task.id,
      task.name,
    ]));

    let untaskedSeconds = 0;
    const tasks = [];
    for (const subGroup of group?.sub_groups || []) {
      if (subGroup.id === null) {
        untaskedSeconds += subGroup.seconds;
      } else {
        tasks.push({
          taskId: subGroup.id,
          taskName: taskNames.get(subGroup.id) ?? null,
          seconds: subGroup.seconds,
        });
      }
    }
    tasks.sort((a, b) => b.seconds - a.seconds);
    const totalSeconds = tasks.reduce((sum, task) => sum + task.seconds, untaskedSeconds);

    $.export("$summary", `Found time on ${tasks.length} ${tasks.length === 1
      ? "task"
      : "tasks"} of project ${this.projectId} from ${dateRange.startDate} to ${dateRange.endDate}`);

    return {
      projectId: this.projectId,
      dateRange,
      totalSeconds,
      tasks,
      untaskedSeconds,
    };
  },
};
