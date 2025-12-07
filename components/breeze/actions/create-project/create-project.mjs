import breeze from "../../breeze.app.mjs";

export default {
  key: "breeze-create-project",
  name: "Create Project",
  description: "Establishes a new project in breeze. [See documentation](https://www.breeze.pm/api#:~:text=Create%20a%20project)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    breeze,
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The workspace to associate the project with",
      optional: true,
      async options() {
        const workspaces = await this.breeze.getWorkspaces();
        return workspaces.map((workspace) => ({
          label: workspace.name || workspace.id,
          value: workspace.id,
        }));
      },
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project to create",
    },
    projectDescription: {
      type: "string",
      label: "Project Description",
      description: "The description of the project",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date for the project (format: `YYYY-MM-DD`)",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date for the project (format: `YYYY-MM-DD`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      workspace_id: this.workspaceId,
      name: this.projectName,
      description: this.projectDescription,
      start_date: this.startDate,
      end_date: this.endDate,
    };

    const response = await this.breeze.createProject({
      $,
      data,
    });

    $.export("$summary", `Successfully created project "${this.projectName}"`);

    return response;
  },
};

