import app from "../../agiled.app.mjs";

export default {
  key: "agiled-create-project",
  name: "Create Project",
  description: "Creates a new project in the Agiled app. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectName: {
      type: "string",
      label: "Project Name",
      description: "Title of the project",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the project. Eg. `2021-01-01`",
    },
    projectSummary: {
      type: "string",
      label: "Project Summary",
      description: "Summary of the project",
      optional: true,
    },
    deadline: {
      type: "string",
      label: "Deadline",
      description: "Deadline of the project. Eg. `2021-01-01`",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for the project",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the project",
      options: [
        {
          label: "In Progress",
          value: "in progress",
        },
        {
          label: "On Hold",
          value: "on hold",
        },
        {
          label: "Canceled",
          value: "canceled",
        },
        {
          label: "Finished",
          value: "finished",
        },
        {
          label: "Not Started",
          value: "not started",
        },
      ],
    },
  },
  methods: {
    createProject(args = {}) {
      return this.app.post({
        path: "/projects",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createProject,
      projectName,
      startDate,
      projectSummary,
      deadline,
      notes,
      status,
    } = this;

    const response = await createProject({
      $,
      data: {
        project_name: projectName,
        start_date: startDate,
        project_summary: projectSummary,
        deadline,
        notes,
        status,
      },
    });

    $.export("$summary", `Successfully created project with ID \`${response.data.id}\``);
    return response;
  },
};
