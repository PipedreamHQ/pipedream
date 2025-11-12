import app from "../../clicktime.app.mjs";

export default {
  key: "clicktime-create-user",
  name: "Create User",
  description: "Create an User on ClickTime. [See the documentation](https://developer.clicktime.com/docs/api/#/operations/Users/CreateManagedUser)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    billingRate: {
      propDefinition: [
        app,
        "billingRate",
      ],
      description: "The billing rate for the user",
      optional: true,
    },
    isActive: {
      propDefinition: [
        app,
        "isActive",
      ],
      description: "Indicates whether the user is currently active",
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "The name of the user",
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
      description: "The start date of the user, i.e.: `2020-01-01`",
      optional: true,
    },
    costModel: {
      propDefinition: [
        app,
        "costModel",
      ],
      optional: true,
    },
    costRate: {
      propDefinition: [
        app,
        "costRate",
      ],
      optional: true,
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
      optional: true,
    },
    role: {
      propDefinition: [
        app,
        "role",
      ],
      optional: true,
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
