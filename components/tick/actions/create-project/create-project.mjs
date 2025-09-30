import tick from "../../tick.app.mjs";

export default {
  name: "Create Project",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "tick-create-project",
  description: "Creates a project. [See docs here](https://github.com/tick/tick-api/blob/master/sections/projects.md#create-project)",
  type: "action",
  props: {
    tick,
    name: {
      label: "Name",
      description: "The name of the project",
      type: "string",
    },
    clientId: {
      propDefinition: [
        tick,
        "clientId",
      ],
    },
    userId: {
      label: "Owner ID",
      propDefinition: [
        tick,
        "userId",
      ],
    },
    budget: {
      label: "Budget",
      description: "The budget of the project. E.g. `50.0`",
      type: "string",
    },
    notifications: {
      label: "Notifications",
      description: "The notifications of the project will be enabled",
      type: "boolean",
    },
    billable: {
      label: "Billable",
      description: "The project is billable",
      type: "boolean",
    },
    recurring: {
      label: "Recurring",
      description: "The project is recurring",
      type: "boolean",
    },
  },
  async run({ $ }) {
    const response = await this.tick.createProject({
      $,
      data: {
        project: {
          name: this.name,
          client_id: this.clientId,
          owner_id: this.userId,
          budget: this.budget,
          notifications: this.notifications,
          billable: this.billable,
          recurring: this.recurring,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created project with id ${response.id}`);
    }

    return response;
  },
};
