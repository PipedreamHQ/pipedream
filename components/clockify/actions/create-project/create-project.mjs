import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-create-project",
  name: "Create Project",
  description: "Creates a new project in Clockify. [See the documentation](https://docs.clockify.me/#tag/Project/operation/create_6)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project",
    },
    clientId: {
      propDefinition: [
        clockify,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Is the project public?",
      optional: true,
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Set new entries on the project as billable",
      optional: true,
    },
    hourlyRate: {
      type: "integer",
      label: "Hourly Rate",
      description: "Hourly rate of the project",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note about the project",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clockify.createProject({
      workspaceId: this.workspaceId,
      data: {
        name: this.name,
        clientId: this.clientId,
        public: this.public,
        billable: this.billable,
        hourlyRate: this.hourlyRate
          ? {
            amount: this.hourlyRate,
          }
          : undefined,
        note: this.note,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created project with ID ${response.id}.`);
    }

    return response;
  },
};
