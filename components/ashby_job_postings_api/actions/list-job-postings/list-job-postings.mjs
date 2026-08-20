import app from "../../ashby_job_postings_api.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ashby_job_postings_api-list-job-postings",
  name: "List Job Postings",
  description: "Lists every published job posting on the Ashby job board configured for the connected account. Use this to browse open roles, or to filter by department, team, location, workplace type, or employment type before drilling into one posting with **Get Job Posting**. The public Job Board API exposes a single non-paginated endpoint that returns all postings, so every filter here is applied client-side after the full list is fetched. [See the documentation](https://developers.ashbyhq.com/docs/public-job-posting-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    includeCompensation: {
      propDefinition: [
        app,
        "includeCompensation",
      ],
    },
    department: {
      type: "string",
      label: "Department",
      description: "Optional client-side filter. Return only postings whose flat `department` field exactly matches this value (e.g. `Engineering`). Case-sensitive exact match applied after fetching all postings.",
      optional: true,
    },
    team: {
      type: "string",
      label: "Team",
      description: "Optional client-side filter. Return only postings whose flat `team` field exactly matches this value (e.g. `Platform`). Applied after fetching all postings.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Optional client-side filter. Return only postings whose `location` field contains this value (case-insensitive). The API returns values like `\"Houston, TX\"` — a partial value like `\"Houston\"` will match. Applied after fetching all postings.",
      optional: true,
    },
    workplaceType: {
      type: "string",
      label: "Workplace Type",
      description: "Optional client-side filter on the `workplaceType` field. One of `OnSite`, `Remote`, `Hybrid`.",
      options: constants.WORKPLACE_TYPES,
      optional: true,
    },
    employmentType: {
      type: "string",
      label: "Employment Type",
      description: "Optional client-side filter on the `employmentType` field. One of `FullTime`, `PartTime`, `Intern`, `Contract`, `Temporary`.",
      options: constants.EMPLOYMENT_TYPES,
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Filter to postings whose `title` contains this value, case-insensitive, e.g. `Engineer` matches `\"Senior Software Engineer\"`. Applied client-side after fetching all postings.",
      optional: true,
    },
    jobUrl: {
      propDefinition: [
        app,
        "jobUrl",
      ],
      description: "Filter to the single posting whose `jobUrl` exactly matches this value. Optional here — provide it only if you already know the exact URL; otherwise use **Get Job Posting** once you've found the posting you want.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listJobPostings({
      $,
      params: {
        includeCompensation: this.includeCompensation,
      },
    });

    let { jobs = [] } = response;

    if (this.department) {
      jobs = jobs.filter((job) => job.department === this.department);
    }
    if (this.team) {
      jobs = jobs.filter((job) => job.team === this.team);
    }
    if (this.location) {
      jobs = jobs.filter((job) => job.location?.toLowerCase()
        .includes(this.location.toLowerCase()));
    }
    if (this.workplaceType) {
      jobs = jobs.filter((job) => job.workplaceType === this.workplaceType);
    }
    if (this.employmentType) {
      jobs = jobs.filter((job) => job.employmentType === this.employmentType);
    }
    if (this.title) {
      jobs = jobs.filter((job) => job.title?.toLowerCase().includes(this.title.toLowerCase()));
    }
    if (this.jobUrl) {
      jobs = jobs.filter((job) => job.jobUrl === this.jobUrl);
    }

    $.export(
      "$summary",
      `Retrieved ${jobs.length} job posting${jobs.length === 1
        ? ""
        : "s"}`,
    );

    return jobs;
  },
};
