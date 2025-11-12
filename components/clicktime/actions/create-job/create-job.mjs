import app from "../../clicktime.app.mjs";

export default {
  key: "clicktime-create-job",
  name: "Create Job",
  description: "Create a Job on Clicktime. [See the documentation](https://developer.clicktime.com/docs/api/#/operations/Jobs/CreateJob)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
      description: "The billing rate for the job",
      optional: true,
    },
    isActive: {
      propDefinition: [
        app,
        "isActive",
      ],
      description: "Indicates whether the job is currently active",
      optional: true,
    },
    isEligibleTimeOffAllocation: {
      propDefinition: [
        app,
        "isEligibleTimeOffAllocation",
      ],
      description: "Determines if the job is eligible for time-off allocation",
      optional: true,
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
      optional: true,
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
      optional: true,
    },
    isBillable: {
      propDefinition: [
        app,
        "isBillable",
      ],
      optional: true,
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
      optional: true,
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
      optional: true,
    },
    timeRequiresApproval: {
      propDefinition: [
        app,
        "timeRequiresApproval",
      ],
      optional: true,
    },
    useCompanyBillingRate: {
      propDefinition: [
        app,
        "useCompanyBillingRate",
      ],
      optional: true,
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
