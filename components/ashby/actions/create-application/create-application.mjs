import app from "../../ashby.app.mjs";

export default {
  key: "ashby-create-application",
  name: "Create Application",
  description: "Considers a candidate for a job (e.g., when sourcing a candidate for a job posting). [See the documentation](https://developers.ashbyhq.com/reference/applicationcreate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    candidateId: {
      propDefinition: [
        app,
        "candidateId",
      ],
      description: "The ID of the candidate to create an application for",
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      description: "The ID of the job to apply for",
    },
    interviewPlanId: {
      optional: true,
      propDefinition: [
        app,
        "interviewPlanId",
      ],
    },
    interviewStageId: {
      optional: true,
      propDefinition: [
        app,
        "interviewStageId",
        ({ interviewPlanId }) => ({
          interviewPlanId,
        }),
      ],
    },
    sourceId: {
      optional: true,
      propDefinition: [
        app,
        "sourceId",
      ],
    },
    creditedToUserId: {
      label: "Credited To User ID",
      description: "The ID of the user the application will be credited to",
      optional: true,
      propDefinition: [
        app,
        "userId",
      ],
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "An ISO date string to set the application's createdAt timestamp (e.g., `2024-01-15T10:30:00Z`). Defaults to the current time if not provided.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      candidateId,
      jobId,
      interviewPlanId,
      interviewStageId,
      sourceId,
      creditedToUserId,
      createdAt,
    } = this;

    const response = await app.createApplication({
      $,
      data: {
        candidateId,
        jobId,
        interviewPlanId,
        interviewStageId,
        sourceId,
        creditedToUserId,
        createdAt,
      },
    });

    $.export("$summary", `Successfully created application with ID \`${response.results?.id}\``);

    return response;
  },
};
