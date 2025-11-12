import cats from "../../cats.app.mjs";

export default {
  key: "cats-add-candidate-pipeline",
  name: "Add Candidate to Job Pipeline",
  description: "Adds a specific candidate to a job pipeline in CATS. [See the documentation](https://docs.catsone.com/api/v3/#jobs-create-a-job)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cats,
    createActivity: {
      type: "boolean",
      label: "Create Activity",
      description: "Whether a corresponding activity should be created automatically. This mimics what happens when a pipeline is created from the CATS UI.",
      optional: true,
    },
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
      type: "integer",
      label: "Rating",
      description: "The record's rating for the job (0-5).",
      optional: true,
    },
  },
  async run({ $ }) {
    const { headers } = await this.cats.addCandidateToJobPipeline({
      $,
      returnFullResponse: true,
      params: {
        create_activity: this.createActivity,
      },
      data: {
        candidate_id: this.candidateId,
        job_id: this.jobId,
        rating: this.rating,
      },
    });

    const location = headers.location.split("/");
    const pipelineId = location[location.length - 1];

    $.export("$summary", `Successfully added candidate ID ${this.candidateId} to job ID ${this.jobId}`);
    return {
      pipelineId,
    };
  },
};
