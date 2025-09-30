import toggl from "../../toggl.app.mjs";

export default {
  key: "toggl-update-project",
  name: "Update Project",
  description: "Updates an existing project in Toggl. [See the documentation](https://engineering.toggl.com/docs/api/projects#put-workspaceproject)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    name: {
      propDefinition: [
        toggl,
        "projectName",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        toggl,
        "startDate",
      ],
      optional: true,
    },
    endDate: {
      propDefinition: [
        toggl,
        "endDate",
      ],
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the project is active or archived.",
      optional: true,
    },
    isPrivate: {
      type: "boolean",
      label: "Is Private?",
      description: "Whether the project is private or not.",
      optional: true,
    },
    isShared: {
      type: "boolean",
      label: "Is Shared?",
      description: "Whether the project is shared or not.",
      optional: true,
    },
    clientId: {
      propDefinition: [
        toggl,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const project = await this.toggl.getProject({
      $,
      workspaceId: this.workspaceId,
      projectId: this.projectId,
    });
    const response = await this.toggl.updateProject({
      $,
      workspaceId: this.workspaceId,
      projectId: this.projectId,
      data: {
        name: this.name || project.name,
        start_date: this.startDate || project.start_date,
        end_date: this.endDate || project.end_date,
        active: this.active || project.active,
        is_private: this.isPrivate || project.isPrivate,
        is_shared: this.isShared || project.is_shared,
        client_id: this.clientId || project.client_id,
      },
    });
    if (response.id) {
      $.export("$summary", `Successfully updated project with ID: ${response.id}`);
    }
    return response;
  },
};
