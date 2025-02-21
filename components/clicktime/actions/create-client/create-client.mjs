import app from "../../clicktime.app.mjs";

export default {
  key: "clicktime-create-client",
  name: "Create Client",
  description: "Create a Client on ClickTime [See the documentation](https://developer.clicktime.com/docs/api/#/Clients)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    accountingPackageId: {
      propDefinition: [
        app,
        "accountingPackageId",
      ],
    },
    billingRate: {
      propDefinition: [
        app,
        "billingRate",
      ],
    },
    clientNumber: {
      propDefinition: [
        app,
        "clientNumber",
      ],
    },
    isActive: {
      propDefinition: [
        app,
        "isActive",
      ],
    },
    isEligibleTimeOffAllocation: {
      propDefinition: [
        app,
        "isEligibleTimeOffAllocation",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
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
