import app from "../../lightspeed_retail_pos.app.mjs";

export default {
  key: "lightspeed_retail_pos-create-employee",
  name: "Create Employee",
  description: "Creates a new employee in the Lightspeed Retail POS system. [See the documentation](https://developers.lightspeedhq.com/retail/endpoints/Employee/#post-create-an-employee)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the employee",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the employee",
    },
    accessPin: {
      type: "string",
      label: "Access Pin",
      description: "The access pin that can be used to quickly switch to this employee when the system is already logged in",
      optional: true,
    },
    lockOut: {
      type: "boolean",
      label: "Lock Out",
      description: "Whether this employee is locked out of the system",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether this employee is archived. Archived employees don’t count towards the account’s employee limit.",
      optional: true,
    },
    limitToShopId: {
      label: "Limit To Shop",
      description: "Identifier of the shop the employee is limited to",
      optional: true,
      propDefinition: [
        app,
        "shopId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    lastShopId: {
      label: "Last Shop",
      description: "Identifier of the shop the employee is currently (or last) attached to",
      optional: true,
      propDefinition: [
        app,
        "shopId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { Employee: employee } = await this.app.createEmployee({
      accountId: this.accountId,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        accessPin: this.accessPin,
        lockOut: this.lockOut,
        archived: this.archived,
        limitToShopID: this.limitToShopId,
        lastShopID: this.lastShopId,
      },
      $,
    });

    if (employee) {
      $.export("$summary", `Successfully created employee with ID ${employee.employeeID}.`);
    }

    return employee;
  },
};
