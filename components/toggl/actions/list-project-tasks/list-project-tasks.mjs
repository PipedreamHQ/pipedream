import { ConfigurationError } from "@pipedream/platform";
import toggl from "../../toggl.app.mjs";
import {
  filterProjectTasks,
  resolveWorkspaceProject,
  unwrapItems,
} from "../../common/utils.mjs";

export default {
  key: "toggl-list-project-tasks",
  name: "List Project Tasks",
  description: "List tasks for one accessible Toggl Track project and optionally search by task name. The project can be supplied by ID or an unambiguous name. Results follow the connected user's Toggl permissions. [See the documentation](https://engineering.toggl.com/docs/track/api/tasks/)",
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
      type: "integer",
      label: "Project ID",
      description: "The project ID. Use this or Project Name, not both.",
      optional: true,
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "An exact or uniquely matching project name, e.g. `Lexamica`. Use this or Project ID, not both.",
      optional: true,
    },
    query: {
      type: "string",
      label: "Task Name",
      description: "Optional case-insensitive task name search.",
      optional: true,
    },
    activeOnly: {
      type: "boolean",
      label: "Active Tasks Only",
      description: "When enabled, exclude completed or inactive tasks.",
      default: false,
    },
  },
  async run({ $ }) {
    if (this.projectId && this.projectName) {
      throw new ConfigurationError("Use Project ID or Project Name, not both.");
    }

    if (!this.projectId && !this.projectName) {
      throw new ConfigurationError("Project ID or Project Name is required.");
    }

    if (this.projectId !== undefined && (
      !Number.isSafeInteger(Number(this.projectId))
      || Number(this.projectId) < 1
    )) {
      throw new ConfigurationError("Project ID must be a positive integer.");
    }

    let project;

    if (this.projectName) {
      const projectsResponse = await this.toggl.getProjects({
        workspaceId: this.workspaceId,
        params: {
          active: "both",
        },
        $,
      });
      project = resolveWorkspaceProject(
        unwrapItems(projectsResponse, "workspace projects"),
        this.projectName,
      );
    } else {
      project = {
        id: Number(this.projectId),
        name: null,
        clientId: null,
        clientName: null,
        active: null,
      };
    }

    const response = await this.toggl.getProjectTasks({
      workspaceId: this.workspaceId,
      projectId: project.id,
      params: {
        ...this.activeOnly && {
          active: true,
        },
      },
      $,
    });
    const tasks = filterProjectTasks(
      unwrapItems(response, "project tasks"),
      this.query,
    );
    const taskIds = new Set();

    for (const task of tasks) {
      if (!Number.isSafeInteger(task.id) || task.id < 1) {
        throw new Error("Toggl returned a project task without a valid task ID.");
      }

      if (taskIds.has(task.id)) {
        throw new Error(`Toggl returned duplicate project task ID ${task.id}.`);
      }

      taskIds.add(task.id);
    }

    const result = {
      project: {
        projectId: project.id,
        projectName: project.name,
        clientId: project.clientId,
        clientName: project.clientName,
      },
      tasks: tasks.map((task) => ({
        taskId: task.id,
        taskName: task.name,
        projectId: task.projectId || project.id,
        active: task.active,
      })),
      returnedCount: tasks.length,
      uniqueTaskCount: taskIds.size,
      duplicateCount: 0,
      complete: true,
      ...this.query && {
        query: this.query,
      },
    };

    $.export("$summary", `Found ${result.returnedCount} unique project ${result.returnedCount === 1
      ? "task"
      : "tasks"}`);

    return result;
  },
};
