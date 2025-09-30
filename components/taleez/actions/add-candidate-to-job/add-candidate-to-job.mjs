import taleez from "../../taleez.app.mjs";

export default {
  key: "taleez-add-candidate-to-job",
  name: "Add Candidate to Job",
  description: "Links an existing candidate to a job offer. [See the documentation](https://api.taleez.com/swagger-ui/index.html#/jobs/addCandidate_1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    taleez,
    candidateId: {
      propDefinition: [
        taleez,
        "candidateId",
      ],
    },
    jobId: {
      propDefinition: [
        taleez,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taleez.linkCandidateToJob({
      $,
      jobId: this.jobId,
      data: {
        ids: [
          this.candidateId,
        ],
      },
    });
    $.export("$summary", `Linked candidate ${this.candidateId} to job ${this.jobId} successfully`);
    return response;
  },
};
