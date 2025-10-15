import tick from "../../tick.app.mjs";

export default {
  name: "Create User",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "tick-create-user",
  description: "Creates a user. [See docs here](https://github.com/tick/tick-api/blob/master/sections/users.md#create-user)",
  type: "action",
  props: {
    tick,
    firstName: {
      label: "First Name",
      description: "The first name of the user",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "The last name of the user",
      type: "string",
    },
    email: {
      label: "Email",
      description: "The email of the user",
      type: "string",
    },
    admin: {
      label: "Is Admin",
      description: "The user will be an admin",
      type: "boolean",
    },
    billableRate: {
      label: "Billable Rate",
      description: "The billable rate of the user. E.g. `150.0`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.tick.createUser({
      $,
      data: {
        user: {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          admin: this.admin
            ? "true"
            : "false",
          billable_rate: this.billableRate,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created user with id ${response.id}`);
    }

    return response;
  },
};
