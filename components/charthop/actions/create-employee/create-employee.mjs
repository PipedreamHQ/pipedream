import charthop from "../../charthop.app.mjs";

export default {
  key: "charthop-create-employee",
  name: "Create Employee",
  description: "Adds a new employee to the system. [See the documentation](https://api.charthop.com/swagger#/user/createUser)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    charthop,
    orgId: {
      propDefinition: [
        charthop,
        "orgId",
      ],
    },
    firstName: {
      propDefinition: [
        charthop,
        "firstName",
      ],
    },
    middleName: {
      propDefinition: [
        charthop,
        "middleName",
      ],
    },
    lastName: {
      propDefinition: [
        charthop,
        "lastName",
      ],
    },
    preferredFirstName: {
      propDefinition: [
        charthop,
        "preferredFirstName",
      ],
    },
    preferredLastName: {
      propDefinition: [
        charthop,
        "preferredLastName",
      ],
    },
    email: {
      propDefinition: [
        charthop,
        "email",
      ],
    },
    status: {
      propDefinition: [
        charthop,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.charthop.createUser({
      $,
      data: {
        orgs: [
          {
            orgId: this.orgId,
            access: "MEMBER",
            roleId: await this.charthop.getEmployeeRoleId($),
          },
        ],
        name: {
          first: this.firstName,
          middle: this.middleName,
          last: this.lastName,
          pref: this.preferredFirstName,
          prefLast: this.preferredLastName,
        },
        email: this.email,
      },
    });
    $.export("$summary", `Successfully created employee with ID: ${response.id}`);
    return response;
  },
};
