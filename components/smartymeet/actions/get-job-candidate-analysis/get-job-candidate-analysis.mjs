import smartymeet from "../../smartymeet.app.mjs";

export default {
  key: "smartymeet-get-job-candidate-analysis",
  name: "Get Job Candidate Analysis",
  description: "Retrieves the analysis for a job candidate within SmartyMeet. [See the documentation](https://docs.smartymeet.com)",
  version: "0.0.1",
  type: "action",
  props: {
    smartymeet,
    jobId: {
      propDefinition: [
        smartymeet,
        "jobId",
      ],
    },
    candidateId: {
      propDefinition: [
        smartymeet,
        "candidateId",
        ({ jobId }) => ({
          jobId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smartymeet.listCandidates({
      $,
      jobId: this.jobId,
    });

    const candidate = response.find((candidate) => `${candidate.shardId}:${candidate.contactId}` === this.candidateId);

    if (candidate) {
      $.export("$summary", `Successfully retrieved analysis for candidate with Id: ${this.candidateId}`);
      return candidate.jobs[0];
    }
    $.export("$summary", `Candidate with Id: ${this.candidateId} not found.`);
  },
};
