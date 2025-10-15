import jobber from "../../jobber.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jobber-filter-quotes",
  name: "Filter Quotes",
  description: "Filter quotes by status, quote number, or cost in Jobber. [See the documentation](https://developer.getjobber.com/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jobber,
    status: {
      type: "string",
      label: "Status",
      description: "The status to filter quotes by",
      options: [
        "draft",
        "awaiting_response",
        "archived",
        "approved",
        "converted",
        "changes_requested",
      ],
      optional: true,
    },
    clientId: {
      propDefinition: [
        jobber,
        "clientId",
      ],
      description: "The client ID to filter quotes by",
      optional: true,
    },
    quoteNumber: {
      type: "string",
      label: "Quote Number",
      description: "The quote number to filter quotes by",
      optional: true,
    },
    cost: {
      type: "string",
      label: "Cost",
      description: "The cost to filter quotes by",
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
    const query = `query FilterQuotes($first: Int, $after: String, $filter: QuoteFilterAttributes) {
      quotes(first: $first, after: $after, filter: $filter) {
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
      filter: {
        status: this.status,
        clientId: this.clientId,
        quoteNumber: this.quoteNumber
          ? {
            eq: +this.quoteNumber,
          }
          : undefined,
        cost: this.cost
          ? {
            eq: +this.cost,
          }
          : undefined,
      },
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
