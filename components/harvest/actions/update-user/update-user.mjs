import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-update-user",
  name: "Update User",
  description: "Update an existing user. Use **List Users** to find a valid ID. Example: call with userId set to a user's ID and lastName set to a new value to update their name. [See the documentation](https://help.getharvest.com/api-v2/users-api/users/users/#update-a-user).",
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
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
      optional: false,
    },
    firstName: {
      propDefinition: [
        harvest,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        harvest,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        harvest,
        "email",
      ],
    },
    timezone: {
      propDefinition: [
        harvest,
        "timezone",
      ],
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
    accessRoles: {
      propDefinition: [
        harvest,
        "accessRoles",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harvest.updateUser({
      $,
      userId: this.userId,
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
        access_roles: this.accessRoles,
      },
    });
    $.export("$summary", `Successfully updated user ${response.id}: ${response.first_name} ${response.last_name}`);
    return response;
  },
};
