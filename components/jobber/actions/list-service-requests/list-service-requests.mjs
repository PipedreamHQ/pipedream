import jobber from "../../jobber.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jobber-list-service-requests",
  name: "List Service Requests",
  description: "Retrieve service request records from Jobber, optionally filtered by a search term. [See the documentation](https://developer.getjobber.com/docs/)",
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
      description: "Filter service requests by a search term",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of service requests to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const query = `query ListRequests($first: Int, $after: String, $searchTerm: String) {
      requests(first: $first, after: $after, searchTerm: $searchTerm) {
        nodes {
          ${constants.REQUEST_FIELDS}
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
    const requests = await this.jobber.getPaginatedResources({
      $,
      query,
      args,
      resourceKey: "requests",
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${requests.length} service request${requests.length === 1
      ? ""
      : "s"}`);
    return requests;
  },
};
