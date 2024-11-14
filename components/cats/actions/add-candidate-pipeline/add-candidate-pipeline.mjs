import cats from "../../cats.app.mjs";

export default {
  key: "cats-add-candidate-pipeline",
  name: "Add Candidate to Job Pipeline",
  description: "Adds a specific candidate to a job pipeline in CATS. [See the documentation](https://docs.catsone.com/api/v3/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cats,
    candidateId: {
      propDefinition: [
        cats,
        "candidateId",
      ],
    },
    jobId: {
      propDefinition: [
        cats,
        "jobId",
      ],
    },
    rating: {
      propDefinition: [
        cats,
        "rating",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      candidate_id: this.candidateId,
      job_id: this.jobId,
    };

    if (this.rating !== undefined) {
      data.rating = this.rating;
    }

    const response = await this.cats.addCandidateToJobPipeline(data);
    $.export("$summary", `Successfully added candidate ID ${this.candidateId} to job pipeline ID ${this.jobId}`);
    return response;
  },
};
