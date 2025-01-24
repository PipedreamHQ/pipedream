import charthop from "../../charthop.app.mjs";

export default {
  key: "charthop-update-employee-details",
  name: "Update Employee Details",
  description: "Updates an existing employee's details. [See the documentation](https://api.charthop.com/swagger#/user/updateUser)",
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
    employeeId: {
      propDefinition: [
        charthop,
        "employeeId",
        (c) => ({
          orgId: c.orgId,
        }),
      ],
    },
    firstName: {
      propDefinition: [
        charthop,
        "firstName",
      ],
      optional: true,
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
      optional: true,
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
      optional: true,
    },
    status: {
      propDefinition: [
        charthop,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const {
      name, email,
    } = await this.charthop.getUser({
      $,
      userId: this.employeeId,
    });
    const response = await this.charthop.updateUser({
      $,
      userId: this.employeeId,
      data: {
        name: {
          first: this.firstName || name.first,
          middle: this.middleName || name.middle,
          last: this.lastName || name.last,
          pref: this.preferredFirstName || name.pref,
          prefLast: this.preferredLastName || name.prefLast,
        },
        email: this.email || email,
      },
    });
    $.export("$summary", `Successfully updated employee with ID ${this.employeeId}`);
    return response;
  },
};
