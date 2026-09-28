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
      propDefinition: [
        harvest,
        "firstName",
      ],
      optional: false,
    },
    lastName: {
      propDefinition: [
        harvest,
        "lastName",
      ],
      optional: false,
    },
    email: {
      propDefinition: [
        harvest,
        "email",
      ],
      optional: false,
    },
    timezone: {
      propDefinition: [
        harvest,
        "timezone",
      ],
      description: "The user's IANA timezone name, e.g. `America/Chicago`. Defaults to the company timezone if omitted.",
    },
    isContractor: {
      propDefinition: [
        harvest,
        "isContractor",
      ],
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Whether the user is active.",
    },
    weeklyCapacity: {
      propDefinition: [
        harvest,
        "weeklyCapacity",
      ],
    },
    defaultHourlyRate: {
      propDefinition: [
        harvest,
        "defaultHourlyRate",
      ],
    },
    costRate: {
      type: "string",
      label: "Cost Rate",
      description: "Cost rate, decimal, e.g. `100` or `100.00`.",
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
