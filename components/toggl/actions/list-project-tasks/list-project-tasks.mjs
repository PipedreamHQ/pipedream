import toggl from "../../toggl.app.mjs";

export default {
  key: "toggl-list-project-tasks",
  name: "List Project Tasks",
  description: "List the tasks under one Toggl Track project, with each task's estimated and tracked seconds. Use it when a user asks what tasks a project has or how much time each task has used. Use **List Workspace Projects** first to get the project ID; there is no workspace-wide task listing, and this action does not return time entries (use **Get Project Activity** for those). Returns an array of tasks with id, name, project_id, workspace_id, active, estimated_seconds and tracked_seconds, empty when the project has none. Example: workspaceId=1234567, projectId=123456789, active=true → the project's active tasks with their estimated and tracked seconds. [See the documentation](https://engineering.toggl.com/docs/api/tasks/#get-tasks)",
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
    active: {
      type: "boolean",
      label: "Active",
      description: "Set `true` to return only active tasks, `false` for only inactive ones, e.g. `true`. Omit to return both.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.toggl.listProjectTasks({
      workspaceId: this.workspaceId,
      projectId: this.projectId,
      $,
    });

    if (response !== null && !Array.isArray(response)) {
      throw new Error("Toggl returned an invalid tasks response.");
    }

    const tasks = (response || [])
      .filter((task) => this.active === undefined || Boolean(task.active) === this.active)
      .map((task) => ({
        id: task.id,
        name: task.name,
        project_id: task.project_id,
        workspace_id: task.workspace_id,
        active: task.active,
        estimated_seconds: task.estimated_seconds,
        // Toggl reports tracked_seconds in milliseconds (estimated_seconds is in seconds).
        tracked_seconds: typeof task.tracked_seconds === "number"
          ? Math.round(task.tracked_seconds / 1000)
          : task.tracked_seconds,
      }));

    $.export("$summary", `Found ${tasks.length} ${tasks.length === 1
      ? "task"
      : "tasks"}`);

    return tasks;
  },
};
