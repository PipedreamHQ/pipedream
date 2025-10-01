import jobber from "../../jobber.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jobber-search-quotes",
  name: "Search Quotes",
  description: "Search for quotes using a search termin Jobber. [See the documentation](https://developer.getjobber.com/docs)",
  version: "0.0.2",
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
      description: "The search term to use to filter quotes",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const query = `query SearchQuotes($first: Int, $after: String, $searchTerm: String) {
      quotes(first: $first, after: $after, searchTerm: $searchTerm) {
        nodes {
          ${constants.QUOTE_FIELDS}
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
    const quotes = await this.jobber.getPaginatedResources({
      query,
      args,
      resourceKey: "quotes",
      max: this.maxResults,
    });
    $.export("$summary", `Successfully found ${quotes.length} quote${quotes.length === 1
      ? ""
      : "s"}`);
    return quotes;
  },
};
