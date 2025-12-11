import app from "../../recruiterflow.app.mjs";

export default {
  key: "recruiterflow-move-candidate-to-stage",
  name: "Move Candidate to Stage",
  description: "Moves a candidate to a different stage in the job pipeline. You can specify either stage ID or stage name. [See the documentation](https://recruiterflow.com/swagger.yml)",
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
      description: "The ID of the candidate to move",
    },
    stageId: {
      type: "integer",
      label: "Stage ID",
      description: "The ID of the destination stage. Use this OR Stage Name (not both).",
      optional: true,
    },
    stageName: {
      type: "string",
      label: "Stage Name",
      description: "The name of the destination stage (e.g., 'Applied', 'Screening', 'Interview', 'Offer', 'Hired'). Use this OR Stage ID (not both). If using stage name, Job ID is required.",
      optional: true,
      options: [
        "Applied",
        "Screening",
        "Interview",
        "Offer",
        "Hired",
      ],
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      label: "Job ID",
      description: "The ID of the job. Required only when using Stage Name instead of Stage ID.",
      optional: true,
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "User ID",
      description: "The ID of the user moving the candidate",
    },
    addedTime: {
      type: "string",
      label: "Added Time",
      description: "Timestamp for backdating when the candidate was moved to the stage (ISO 8601 format, e.g., '2021-01-12T10:16:16+0000')",
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
      stageId,
      stageName,
      jobId,
      userId,
      addedTime,
    } = this;

    // Validate that either stageId or stageName is provided
    if (!stageId && !stageName) {
      throw new Error("Either Stage ID or Stage Name must be provided");
    }

    if (stageId && stageName) {
      throw new Error("Provide either Stage ID or Stage Name, not both");
    }

    // Validate that jobId is provided when using stageName
    if (stageName && !jobId) {
      throw new Error("Job ID is required when using Stage Name");
    }

    const data = {
      id: candidateId,
      stage: {},
    };

    // Set stage by ID or name
    if (stageId) {
      data.stage.id = stageId;
    } else {
      data.stage.name = stageName;
      data.job_id = jobId;
    }

    if (userId) {
      data.user_id = userId;
    }

    if (addedTime) {
      data.added_time = addedTime;
    }

    const response = await app.moveCandidateToStage({
      $,
      data,
    });

    const stageDescription = stageId
      ? `stage ID ${stageId}`
      : `stage ${stageName}`;
    $.export("$summary", `Successfully moved candidate to ${stageDescription}`);
    return response;
  },
};
