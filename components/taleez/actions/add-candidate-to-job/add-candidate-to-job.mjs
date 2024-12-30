import taleez from "../../taleez.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "taleez-add-candidate-to-job",
  name: "Add Candidate to Job",
  description: "Links an existing candidate to a job offer. [See the documentation]()",
  version: "0.0.{{ts}}",
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
    const response = await this.taleez.linkCandidateToJobOffer({
      data: {
        candidate_id: this.candidateId,
        job_id: this.jobId,
      },
    });
    $.export("$summary", `Linked candidate ${this.candidateId} to job ${this.jobId} successfully`);
    return response;
  },
};
