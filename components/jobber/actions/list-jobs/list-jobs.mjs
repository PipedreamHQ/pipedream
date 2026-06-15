import jobber from "../../jobber.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jobber-list-jobs",
  name: "List Jobs",
  description: "Retrieve job records from Jobber, optionally filtered by a search term. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jobber,
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Filter jobs by a search term",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of jobs to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const query = `query ListJobs($first: Int, $after: String, $searchTerm: String) {
      jobs(first: $first, after: $after, searchTerm: $searchTerm) {
        nodes {
          ${constants.JOB_FIELDS}
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }`;

    const args = {
      searchTerm: this.searchTerm,
    };
    const jobs = await this.jobber.getPaginatedResources({
      $,
      query,
      args,
      resourceKey: "jobs",
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${jobs.length} job${jobs.length === 1
      ? ""
      : "s"}`);
    return jobs;
  },
};
