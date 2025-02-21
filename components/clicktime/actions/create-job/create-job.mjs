import app from "../../clicktime.app.mjs";

export default {
  key: "clicktime-create-job",
  name: "Create Job",
  description: "Create a Job on Clicktime. [See the documentation](https://developer.clicktime.com/docs/api/#/operations/Jobs/CreateJob)",
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
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    includeInRm: {
      propDefinition: [
        app,
        "includeInRm",
      ],
    },
    isBillable: {
      propDefinition: [
        app,
        "isBillable",
      ],
    },
    jobNumber: {
      propDefinition: [
        app,
        "jobNumber",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    timeRequiresApproval: {
      propDefinition: [
        app,
        "timeRequiresApproval",
      ],
    },
    useCompanyBillingRate: {
      propDefinition: [
        app,
        "useCompanyBillingRate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createJob({
      $,
      data: {
        AccountingPackageID: this.accountingPackageId,
        BillingRate: this.billingRate,
        IsActive: this.isActive,
        IsEligibleTimeOffAllocation: this.isEligibleTimeOffAllocation,
        Name: this.name,
        Notes: this.notes,
        ClientID: this.clientId,
        EndDate: this.endDate,
        IncludeInRM: this.includeInRm,
        IsBillable: this.isBillable,
        JobNumber: this.jobNumber,
        StartDate: this.startDate,
        TimeRequiresApproval: this.timeRequiresApproval,
        UseCompanyBillingRate: this.useCompanyBillingRate,
      },
    });
    $.export("$summary", `Successfully created Job with ID: ${response.data.ID}`);
    return response;
  },
};
