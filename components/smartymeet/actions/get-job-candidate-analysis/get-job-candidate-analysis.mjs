import smartymeet from "../../smartymeet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "smartymeet-get-job-candidate-analysis",
  name: "Get Job Candidate Analysis",
  description: "Retrieves the analysis for a job candidate within SmartyMeet. [See the documentation](https://docs.smartymeet.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    smartymeet,
    candidateId: {
      propDefinition: [
        smartymeet,
        "candidateId",
      ],
    },
    analysisType: {
      propDefinition: [
        smartymeet,
        "analysisType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smartymeet.retrieveCandidateAnalysis({
      candidateId: this.candidateId,
      analysisType: this.analysisType,
    });

    $.export("$summary", `Successfully retrieved analysis for candidate ID ${this.candidateId}`);
    return response;
  },
};
