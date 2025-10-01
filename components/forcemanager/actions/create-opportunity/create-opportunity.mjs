import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-create-opportunity",
  name: "Create Opportunity",
  description: "Creates a new business opportunity in ForceManager. [See the documentation](https://developer.forcemanager.com/#836754be-f32d-47d2-a8ab-73a147c62ca9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    forcemanager,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the business opportunity",
    },
    accountId: {
      propDefinition: [
        forcemanager,
        "accountId",
      ],
    },
    branchId: {
      propDefinition: [
        forcemanager,
        "branchId",
      ],
    },
    statusId: {
      propDefinition: [
        forcemanager,
        "statusId",
      ],
    },
    salesProbability: {
      type: "integer",
      label: "Sales Probability",
      description: "Probability of sale, a number between 0 and 10",
      max: 10,
    },
    salesRepId: {
      propDefinition: [
        forcemanager,
        "salesRepId",
      ],
    },
    salesForeCastDate: {
      type: "string",
      label: "Sales Forecast Date",
      description: "Forecast sale date in ISO-8601 Format. Example: `2023-12-08T10:00:00+07:00`",
      optional: true,
    },
    currencyId: {
      propDefinition: [
        forcemanager,
        "currencyId",
      ],
    },
    total: {
      type: "integer",
      label: "Total",
      description: "Total amount of the Opportunity",
      optional: true,
    },
    permissionLevel: {
      type: "string",
      label: "PermissionLevel",
      description: "Defines the visibility of the Opportunity. Set from 1 - 5 with 5 being the highest level of permission",
      options: [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.forcemanager.createOpportunity({
      $,
      data: {
        reference: this.name,
        accountId1: this.accountId,
        branchId: this.branchId,
        statusId: this.statusId,
        salesProbability: this.salesProbability,
        salesRepId: this.salesRepId,
        salesForeCastDate: this.salesForeCastDate,
        total: this.total,
        permissionLevel: this.permissionLevel,
      },
    });
    $.export("$summary", `Successfully created opportunity: ${this.name}`);
    return response;
  },
};
