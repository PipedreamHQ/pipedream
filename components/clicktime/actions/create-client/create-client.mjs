import app from "../../clicktime.app.mjs";

export default {
  key: "clicktime-create-client",
  name: "Create Client",
  description: "Create a Client on ClickTime [See the documentation](https://developer.clicktime.com/docs/api/#/Clients)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    clientNumber: {
      propDefinition: [
        app,
        "clientNumber",
      ],
      optional: true,
    },
    accountingPackageId: {
      propDefinition: [
        app,
        "accountingPackageId",
      ],
      optional: true,
    },
    billingRate: {
      propDefinition: [
        app,
        "billingRate",
      ],
      description: "The billing rate for the client",
      optional: true,
    },
    isActive: {
      propDefinition: [
        app,
        "isActive",
      ],
      description: "Indicates whether the client is currently active",
      optional: true,
    },
    isEligibleTimeOffAllocation: {
      propDefinition: [
        app,
        "isEligibleTimeOffAllocation",
      ],
      description: "Determines if the client is eligible for time-off allocation",
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "The name of the client",
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
      description: "Additional information related to the client",
      optional: true,
    },
    shortName: {
      propDefinition: [
        app,
        "shortName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createClient({
      $,
      data: {
        AccountingPackageID: this.accountingPackageId,
        BillingRate: this.billingRate,
        ClientNumber: this.clientNumber,
        IsActive: this.isActive,
        IsEligibleTimeOffAllocation: this.isEligibleTimeOffAllocation,
        Name: this.name,
        Notes: this.notes,
        ShortName: this.shortName,
      },
    });
    $.export("$summary", `Successfully created Client with the ID: ${response.data.ID}`);
    return response;
  },
};
