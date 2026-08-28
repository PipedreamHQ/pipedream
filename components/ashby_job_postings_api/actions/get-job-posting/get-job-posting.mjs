// x-pd-ai: optimized
import app from "../../ashby_job_postings_api.app.mjs";

export default {
  key: "ashby_job_postings_api-get-job-posting",
  name: "Get Job Posting",
  description: "Retrieves the full details of one published job posting from the Ashby job board configured for the connected account, including its description and, optionally, its compensation breakdown. The public Job Board API has no single-item lookup endpoint, so this fetches the full board listing and returns the one posting whose `jobUrl` exactly matches. Use **List Job Postings** first to find the `jobUrl` of the posting you want. [See the documentation](https://developers.ashbyhq.com/docs/public-job-posting-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    jobUrl: {
      propDefinition: [
        app,
        "jobUrl",
      ],
    },
    includeCompensation: {
      propDefinition: [
        app,
        "includeCompensation",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listJobPostings({
      $,
      params: {
        includeCompensation: this.includeCompensation,
      },
    });

    const { jobs = [] } = response;
    const job = jobs.find((j) => j.jobUrl === this.jobUrl);

    if (!job) {
      throw new Error(
        `No job posting found with jobUrl "${this.jobUrl}".`
        + " Use **List Job Postings** to find a valid `jobUrl`.",
      );
    }

    $.export("$summary", `Retrieved job posting "${job.title}"`);

    return job;
  },
};
