import bilflo from "../../bilflo.app.mjs";

export default {
  key: "bilflo-create-contract-job",
  name: "Create Contract Job",
  description: "Creates a new contract job in Bilflo. [See the documentation](https://developer.bilflo.com/documentation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bilflo,
    clientId: {
      propDefinition: [
        bilflo,
        "clientId",
      ],
    },
    contractorId: {
      type: "integer",
      label: "Contractor ID",
      description: "The unique identifier for the contractor.",
    },
    contractorTypeId: {
      type: "integer",
      label: "Contractor Type ID",
      description: "The unique identifier for the contractor type.",
      options: [
        {
          label: "W2",
          value: 1,
        },
        {
          label: "1099",
          value: 2,
        },
      ],
    },
    timeCardMethodId: {
      type: "integer",
      label: "Time Card Method ID",
      description: "The unique identifier for the time card method.",
    },
    overtimeRuleId: {
      type: "integer",
      label: "Overtime Rule ID",
      description: "The unique identifier for the overtime rule.",
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The title of the job.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the contract job. **Format YYYY-MM-DDTHH:MM:SSZ**",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the contract job. **Format YYYY-MM-DDTHH:MM:SSZ**",
    },
    firstWeekEndingDate: {
      type: "string",
      label: "First Week Ending Date",
      description: "The first week ending date of the contract job. **Format YYYY-MM-DDTHH:MM:SSZ**",
    },
    burdenTypeId: {
      type: "integer",
      label: "Burden Type ID",
      description: "The unique identifier for the burden type.",
    },
  },
  async run({ $ }) {
    const response = await this.bilflo.createContractJob({
      $,
      data: {
        clientId: this.clientId,
        contractorId: this.contractorId,
        contractorTypeId: this.contractorTypeId,
        timeCardMethodId: this.timeCardMethodId,
        overtimeRuleId: this.overtimeRuleId,
        jobTitle: this.jobTitle,
        startDate: this.startDate,
        endDate: this.endDate,
        firstWeekEndingDate: this.firstWeekEndingDate,
        burdenTypeId: this.burdenTypeId,
      },
    });

    $.export("$summary", `Successfully created contract job Id: ${response.data.jobId}`);
    return response;
  },
};
