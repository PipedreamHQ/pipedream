import greenhouseJobBoardApi from "../../greenhouse_job_board_api.app.mjs";

export default {
  key: "greenhouse_job_board_api-get-job",
  name: "Get Job",
  description: "Retrieve the full detail object for a single job post via `GET /{board_token}/jobs/{job_id}`. Use **List Jobs** to find valid job post IDs. Returns the full job object. Example: `Job ID` `4001` returns `{ \"id\": 4001, \"title\": \"Senior Backend Engineer\", \"content\": \"<p>We are hiring...</p>\", \"location\": { \"name\": \"Remote\" }, \"absolute_url\": \"https://boards.greenhouse.io/acme/jobs/4001\" }` — pass `Include Questions: true` to also get the application questions. [See the documentation](https://developers.greenhouse.io/job-board.html#retrieve-a-job).",
  version: "0.0.1",
  ai: "optimized",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    greenhouseJobBoardApi,
    jobId: {
      propDefinition: [
        greenhouseJobBoardApi,
        "jobId",
      ],
    },
    questions: {
      type: "boolean",
      label: "Include Questions",
      description: "When `true`, adds `questions`, `location_questions`, `compliance`, and `demographic_questions` to the response. Defaults to `false`.",
      optional: true,
    },
    payTransparency: {
      type: "boolean",
      label: "Include Pay Transparency",
      description: "When `true`, adds `pay_input_ranges` to the response. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.greenhouseJobBoardApi.getJob({
      $,
      jobId: this.jobId,
      params: {
        questions: this.questions,
        pay_transparency: this.payTransparency,
      },
    });
    $.export("$summary", `Retrieved job ${response.id}: ${response.title}`);
    return response;
  },
};
