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
      description: "The billing rate for the job",
    },
    isActive: {
      propDefinition: [
        app,
        "isActive",
      ],
      description: "Indicates whether the job is currently active",
    },
    isEligibleTimeOffAllocation: {
      propDefinition: [
        app,
        "isEligibleTimeOffAllocation",
      ],
      description: "Determines if the client is eligible for time-off allocation",
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "The name of the job",
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
      description: "Additional information related to the job",
    },
    clientId: {
      propDefinition: [
        app,
        "clientId",
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
      description: "The start date of the job, i.e.: `2020-01-01`",
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
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
