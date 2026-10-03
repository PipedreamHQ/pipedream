import greenhouseJobBoardApi from "../../greenhouse_job_board_api.app.mjs";

export default {
  key: "greenhouse_job_board_api-list-jobs",
  name: "List Jobs",
  description: "List published jobs for the connected Greenhouse job board (no company or board input is needed — it always targets the connected account) via `GET /{board_token}/jobs`. Use this to discover job post IDs before calling **Get Job** or **Submit Application**. Returns `{ total_count, returned_count, note, jobs }`: the `jobs` array is capped at `limit` (default 25) and projected to a compact set of fields per job (`id`, `title`, `location`) so large boards (hundreds of jobs) fit within the response size limit — `total_count` reports how many exist and `note` appears when results were truncated. Call **Get Job** for a single job's full description, questions, and pay ranges. To find roles by keyword (e.g. \"engineer\", \"sales\"), pass `titleQuery` rather than raising `limit` to page through the whole board — the API has no server-side search, so `titleQuery` filters by title for you. Pass `fields` to include more per-job fields (e.g. `absolute_url`, `updated_at`, `requisition_id`, `company_name`) or `[\"all\"]` for the raw objects, and `limit` to return more rows. Example: calling with no inputs returns `{ \"total_count\": 673, \"returned_count\": 25, \"note\": \"Showing the first 25 of 673 jobs...\", \"jobs\": [{ \"id\": 4001, \"title\": \"Senior Backend Engineer\", \"location\": { \"name\": \"Remote\" } }, ...] }`; calling with `fields: [\"id\", \"title\", \"absolute_url\"]` adds each job's apply URL. [See the documentation](https://developers.greenhouse.io/job-board.html#list-jobs).",
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
    titleQuery: {
      type: "string",
      label: "Title Query",
      description: "Case-insensitive substring to filter jobs by title. The Greenhouse job board API has no server-side search, so use this to find roles by keyword instead of raising `limit` to fetch the whole board (which can exceed the response size limit). Example: `engineer` returns only jobs whose title contains \"engineer\".",
      optional: true,
    },
    fields: {
      propDefinition: [
        greenhouseJobBoardApi,
        "fields",
      ],
      description: "Which fields to return per job. Defaults to a compact set (`id`, `title`, `location`). Add more (e.g. `absolute_url`, `updated_at`, `requisition_id`, `company_name`, `metadata`) or pass `[\"all\"]` for the raw objects — note that the full objects can exceed the response size limit on large boards.",
    },
    limit: {
      propDefinition: [
        greenhouseJobBoardApi,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.greenhouseJobBoardApi.listJobs({
      $,
    });
    let jobs = response.jobs;
    if (this.titleQuery) {
      const q = this.titleQuery.toLowerCase();
      jobs = jobs.filter((job) => (job.title || "").toLowerCase().includes(q));
    }
    const result = this.greenhouseJobBoardApi.buildListResponse({
      items: jobs,
      key: "jobs",
      defaultFields: [
        "id",
        "title",
        "location",
      ],
      fields: this.fields,
      limit: this.limit,
    });
    $.export("$summary", `Returning ${result.returned_count} of ${result.total_count} published job(s) for board "${this.greenhouseJobBoardApi.getBoardToken()}"`);
    return result;
  },
};
