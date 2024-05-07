import bilflo from "../../bilflo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bilflo-create-contract-job",
  name: "Create Contract Job",
  description: "Creates a new contract job in Bilflo. [See the documentation](https://developer.bilflo.com/documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bilflo,
    clientId: bilflo.propDefinitions.clientId,
    contractorId: bilflo.propDefinitions.contractorId,
    contractorTypeId: bilflo.propDefinitions.contractorTypeId,
    timeCardMethodId: bilflo.propDefinitions.timeCardMethodId,
    overtimeRuleId: bilflo.propDefinitions.overtimeRuleId,
    jobTitle: bilflo.propDefinitions.jobTitle,
    startDate: bilflo.propDefinitions.startDate,
    endDate: bilflo.propDefinitions.endDate,
    firstWeekEndingDate: bilflo.propDefinitions.firstWeekEndingDate,
    burdenTypeId: bilflo.propDefinitions.burdenTypeId,
  },
  async run({ $ }) {
    const response = await this.bilflo.createContractJob({
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
    });

    $.export("$summary", `Successfully created contract job with title '${this.jobTitle}'`);
    return response;
  },
};
