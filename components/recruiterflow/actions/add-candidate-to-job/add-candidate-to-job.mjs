import app from "../../recruiterflow.app.mjs";

export default {
  key: "recruiterflow-add-candidate-to-job",
  name: "Add Candidate to Job",
  description: "Associates a candidate with a job posting in Recruiterflow. [See the documentation](https://recruiterflow.com/swagger.yml)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    candidateId: {
      propDefinition: [
        app,
        "candidateId",
      ],
      label: "Candidate ID",
      description: "The ID of the candidate to add to the job",
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      label: "Job ID",
      description: "The ID of the job to add the candidate to",
    },
    addedTime: {
      type: "string",
      label: "Added Time",
      description: "Timestamp for backdating when the candidate was added to the job (ISO 8601 format, e.g., `2021-01-12T10:16:16+0000`)",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const {
      app,
      candidateId,
      jobId,
      addedTime,
    } = this;

    const response = await app.addCandidateToJob({
      $,
      data: {
        id: candidateId,
        job_id: jobId,
        added_time: addedTime,
      },
    });

    $.export("$summary", "Successfully added candidate to job");
    return response;
  },
};
