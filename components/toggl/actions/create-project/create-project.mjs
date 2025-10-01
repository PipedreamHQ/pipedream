import toggl from "../../toggl.app.mjs";

export default {
  key: "toggl-create-project",
  name: "Create Project",
  description: "Create a new project in Toggl. [See the documentation](https://engineering.toggl.com/docs/api/projects#post-workspaceprojects)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    name: {
      propDefinition: [
        toggl,
        "projectName",
      ],
    },
    startDate: {
      propDefinition: [
        toggl,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        toggl,
        "endDate",
      ],
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the project is active or archived. Defaults to `true`.",
      optional: true,
      default: true,
    },
    isPrivate: {
      type: "boolean",
      label: "Is Private?",
      description: "Whether the project is private or not. Defaults to `false`.",
      optional: true,
      default: false,
    },
    isShared: {
      type: "boolean",
      label: "Is Shared?",
      description: "Whether the project is shared or not. Defaults to `false`.",
      optional: true,
      default: false,
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
    const response = await this.toggl.createProject({
      $,
      workspaceId: this.workspaceId,
      data: {
        name: this.name,
        start_date: this.startDate,
        end_date: this.endDate,
        active: this.active,
        is_private: this.isPrivate,
        is_shared: this.isShared,
        client_id: this.clientId,
      },
    });
    if (response.id) {
      $.export("$summary", `Successfully created project with ID: ${response.id}`);
    }
    return response;
  },
};
