// x-pd-ai: optimized
import app from "../../ashby_job_postings_api.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "ashby_job_postings_api-list-job-postings",
  name: "List Job Postings",
  description: "Fetch published job postings from a public Ashby job board via `GET /posting-api/job-board/{JOB_BOARD_NAME}`. Use this to list, search, or retrieve a specific posting: the public Job Board API exposes a single list-all endpoint, so all department/team/location/workplace/employment/title/jobUrl filtering is applied client-side to the returned `jobs` array. Provide the board name (the final path segment of `https://jobs.ashbyhq.com/{BOARD_NAME}`, e.g. `Ashby`). To retrieve a specific posting, filter by `title` (partial, case-insensitive) or `jobUrl` (exact match). The API returns every published posting in one non-paginated response `{ apiVersion, jobs: [...] }`. [See the documentation](https://developers.ashbyhq.com/docs/public-job-posting-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    boardName: {
      type: "string",
      label: "Board Name",
      description: "The job board identifier - the final path segment of the public board URL `https://jobs.ashbyhq.com/{BOARD_NAME}` (e.g. `Ashby`). Passed as a URL path segment to the posting API.",
    },
    includeCompensation: {
      type: "boolean",
      label: "Include Compensation",
      description: "When `true`, include the `compensation` object on each posting (maps to the `includeCompensation` query parameter). Defaults to `false`.",
      optional: true,
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
      description: "Optional client-side filter. Return only postings whose `title` contains this value (case-insensitive). For example, `Engineer` matches `Senior Software Engineer`. Use this to find or retrieve a specific posting by name. Applied after fetching all postings.",
      optional: true,
    },
    jobUrl: {
      type: "string",
      label: "Job URL",
      description: "Optional client-side filter. Return only the posting whose `jobUrl` exactly matches this value (e.g. `https://jobs.ashbyhq.com/Ashby/abc123`). Use this to retrieve a single specific posting by its public URL. Applied after fetching all postings.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listJobPostings({
      $,
      boardName: this.boardName,
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
        : "s"} from board "${this.boardName}"`,
    );

    return jobs;
  },
};
