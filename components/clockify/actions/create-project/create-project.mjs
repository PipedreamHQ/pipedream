// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-create-project",
  name: "Create Project",
  description: "Creates a new project in a Clockify workspace. Only the name is required; link the project to a client so its time can be invoiced, and set an hourly rate to make tracked time billable at that rate. Use **Add Task To Project** afterwards to add the tasks that time entries are logged against. [See the documentation](https://docs.clockify.me/#tag/Project/operation/create_6)",
  version: "0.0.4",
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
      description: "Hourly rate of the project, as a whole number in the currency's minor units (cents) — e.g. `20000` for a rate of 200.00. Must be 0 or greater",
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
        isPublic: this.public,
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

    $.export("$summary", `Successfully created project with ID ${response.id}`);

    return response;
  },
};
