import jobber from "../../jobber.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jobber-list-invoices",
  name: "List Invoices",
  description: "Retrieve invoice records from Jobber, optionally filtered by a search term. [See the documentation](https://developer.getjobber.com/docs/)",
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
      description: "Filter invoices by a search term",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of invoices to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const query = `query ListInvoices($first: Int, $after: String, $searchTerm: String) {
      invoices(first: $first, after: $after, searchTerm: $searchTerm) {
        nodes {
          ${constants.INVOICE_FIELDS}
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
    const invoices = await this.jobber.getPaginatedResources({
      query,
      args,
      resourceKey: "invoices",
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${invoices.length} invoice${invoices.length === 1
      ? ""
      : "s"}`);
    return invoices;
  },
};
