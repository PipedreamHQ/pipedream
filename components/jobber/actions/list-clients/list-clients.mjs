import jobber from "../../jobber.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jobber-list-clients",
  name: "List Clients",
  description: "Retrieve client records from Jobber, optionally filtered by a search term. [See the documentation](https://developer.getjobber.com/docs/)",
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
      description: "Filter clients by a search term (e.g. name, company, email, or phone number)",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of clients to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const query = `query ListClients($first: Int, $after: String, $searchTerm: String) {
      clients(first: $first, after: $after, searchTerm: $searchTerm) {
        nodes {
          ${constants.CLIENT_FIELDS}
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
    const clients = await this.jobber.getPaginatedResources({
      query,
      args,
      resourceKey: "clients",
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${clients.length} client${clients.length === 1
      ? ""
      : "s"}`);
    return clients;
  },
};
