import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-create-user",
  name: "Create User",
  description: "Create a new user in the Harvest account. Example: call with firstName=\"Ian\", lastName=\"Malcolm\", email=\"ian.malcolm@example.com\" to add a new team member. [See the documentation](https://help.getharvest.com/api-v2/users-api/users/users/#create-a-user).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address.",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The user's timezone. Defaults to the company timezone.",
      optional: true,
    },
    isContractor: {
      type: "boolean",
      label: "Is Contractor",
      description: "Whether the user is a contractor.",
      optional: true,
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Whether the user is active.",
    },
    weeklyCapacity: {
      type: "integer",
      label: "Weekly Capacity",
      description: "Expected weekly working capacity in seconds.",
      optional: true,
    },
    defaultHourlyRate: {
      type: "string",
      label: "Default Hourly Rate",
      description: "Default hourly rate, decimal.",
      optional: true,
    },
    costRate: {
      type: "string",
      label: "Cost Rate",
      description: "Cost rate, decimal.",
      optional: true,
    },
    accessRoles: {
      propDefinition: [
        harvest,
        "accessRoles",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harvest.createUser({
      $,
      accountId: this.accountId,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        timezone: this.timezone,
        is_contractor: this.isContractor,
        is_active: this.isActive,
        weekly_capacity: this.weeklyCapacity,
        default_hourly_rate: this.defaultHourlyRate,
        cost_rate: this.costRate,
        access_roles: this.accessRoles,
      },
    });
    $.export("$summary", `Successfully created user ${response.id}: ${response.first_name} ${response.last_name}`);
    return response;
  },
};
