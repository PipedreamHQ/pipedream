import toggl from "../../toggl.app.mjs";
import {
  filterWorkspaceProjects,
  unwrapItems,
} from "../../common/utils.mjs";

export default {
  key: "toggl-list-workspace-projects",
  name: "List Workspace Projects",
  description: "List projects visible to the connected Toggl Track account and optionally search by project or client name. Use the returned project IDs with project activity and report actions. Results follow the connected user's Toggl permissions. [See the documentation](https://engineering.toggl.com/docs/track/api/projects/)",
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
    query: {
      type: "string",
      label: "Project or Client Name",
      description: "Optional case-insensitive project or client name search, e.g. `Lexamica`.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Project Status",
      description: "Return active projects, archived projects, or both.",
      options: [
        "active",
        "archived",
        "both",
      ],
      default: "both",
    },
  },
  async run({ $ }) {
    const response = await this.toggl.getProjects({
      workspaceId: this.workspaceId,
      params: {
        active: "both",
      },
      $,
    });
    const allProjects = filterWorkspaceProjects(
      unwrapItems(response, "workspace projects"),
      this.query,
    );
    const projects = allProjects.filter((project) => (
      this.status === "both"
      || (this.status === "active" && project.active)
      || (this.status === "archived" && !project.active)
    ));
    const projectIds = new Set();

    for (const project of projects) {
      if (!Number.isSafeInteger(project.id) || project.id < 1) {
        throw new Error("Toggl returned a workspace project without a valid project ID.");
      }

      if (projectIds.has(project.id)) {
        throw new Error(`Toggl returned duplicate workspace project ID ${project.id}.`);
      }

      projectIds.add(project.id);
    }

    const result = {
      projects: projects.map((project) => ({
        projectId: project.id,
        projectName: project.name,
        clientId: project.clientId,
        clientName: project.clientName,
        active: project.active,
      })),
      returnedCount: projects.length,
      uniqueProjectCount: projectIds.size,
      duplicateCount: 0,
      complete: true,
      ...this.query && {
        query: this.query,
      },
    };

    $.export("$summary", `Found ${result.returnedCount} unique workspace ${result.returnedCount === 1
      ? "project"
      : "projects"}`);

    return result;
  },
};
