import app from "../../clicktime.app.mjs";

export default {
  key: "clicktime-create-user",
  name: "Create User",
  description: "Create an User on ClickTime. [See the documentation](https://developer.clicktime.com/docs/api/#/operations/Users/CreateManagedUser)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    billingRate: {
      propDefinition: [
        app,
        "billingRate",
      ],
    },
    isActive: {
      propDefinition: [
        app,
        "isActive",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    costModel: {
      propDefinition: [
        app,
        "costModel",
      ],
    },
    costRate: {
      propDefinition: [
        app,
        "costRate",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    employmentTypeId: {
      propDefinition: [
        app,
        "employmentTypeId",
      ],
    },
    role: {
      propDefinition: [
        app,
        "role",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createUser({
      $,
      data: {
        BillingRate: this.billingRate,
        IsActive: this.isActive,
        Name: this.name,
        StartDate: this.startDate,
        CostModel: this.costModel,
        CostRate: this.costRate,
        Email: this.email,
        EmploymentTypeID: this.employmentTypeId,
        Role: this.role,
      },
    });
    $.export("$summary", `Successfully created User with the ID: ${response.data.ID}`);
    return response;
  },
};
