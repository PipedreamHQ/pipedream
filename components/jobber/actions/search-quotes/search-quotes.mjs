import jobber from "../../jobber.app.mjs";

export default {
  key: "jobber-search-quotes",
  name: "Search Quotes",
  description: "Search for quotes in Jobber with various filters. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    jobber,
    clientId: {
      propDefinition: [
        jobber,
        "clientId",
      ],
      optional: true,
      description: "Filter quotes by client ID",
    },
    propertyId: {
      propDefinition: [
        jobber,
        "propertyId",
      ],
      optional: true,
      description: "Filter quotes by property ID",
    },
    quoteStatus: {
      type: "string",
      label: "Quote Status",
      description: "Filter quotes by status",
      optional: true,
      options: [
        {
          label: "Draft",
          value: "DRAFT",
        },
        {
          label: "Sent",
          value: "SENT",
        },
        {
          label: "Accepted",
          value: "ACCEPTED",
        },
        {
          label: "Declined",
          value: "DECLINED",
        },
        {
          label: "Expired",
          value: "EXPIRED",
        },
        {
          label: "Converted",
          value: "CONVERTED",
        },
      ],
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Search in quote title, message, or quote number",
      optional: true,
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "Filter quotes created from this date (YYYY-MM-DD)",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "Filter quotes created until this date (YYYY-MM-DD)",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of quotes to return",
      default: 50,
      min: 1,
      max: 100,
    },
    includeLineItems: {
      type: "boolean",
      label: "Include Line Items",
      description: "Include line items in the response",
      default: true,
      optional: true,
    },
    includeNotes: {
      type: "boolean",
      label: "Include Notes",
      description: "Include notes in the response",
      default: false,
      optional: true,
    },
    includeCustomFields: {
      type: "boolean",
      label: "Include Custom Fields",
      description: "Include custom fields in the response",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      clientId,
      propertyId,
      quoteStatus,
      searchTerm,
      dateFrom,
      dateTo,
      limit,
      includeLineItems,
      includeNotes,
      includeCustomFields,
    } = this;

    // Build filter conditions
    const filters = [];

    if (clientId) {
      filters.push(`clientId: "${clientId}"`);
    }

    if (propertyId) {
      filters.push(`propertyId: "${propertyId}"`);
    }

    if (quoteStatus) {
      filters.push(`quoteStatus: ${quoteStatus}`);
    }

    if (searchTerm) {
      filters.push(`searchTerm: "${searchTerm}"`);
    }

    if (dateFrom) {
      filters.push(`createdAtGte: "${dateFrom}"`);
    }

    if (dateTo) {
      filters.push(`createdAtLte: "${dateTo}"`);
    }

    const filterString = filters.length > 0
      ? `(filter: {${filters.join(", ")}})`
      : "";

    // Build the GraphQL query
    let query = `query SearchQuotes {
      quotes${filterString}(first: ${limit}) {
        nodes {
          id
          quoteNumber
          title
          message
          quoteStatus
          previewUrl
          jobberWebUri
          createdAt
          updatedAt
          transitionedAt
          clientHubViewedAt
          client {
            id
            firstName
            lastName
            companyName
          }
          property {
            id
            address {
              street
              city
              state
              zip
            }
          }
          amounts {
            subtotal
            tax
            total
          }`;

    if (includeLineItems) {
      query += `
          lineItems {
            nodes {
              id
              name
              description
              quantity
              unitPrice
              total
            }
          }`;
    }

    if (includeNotes) {
      query += `
          notes {
            nodes {
              id
              body
              createdAt
            }
          }`;
    }

    if (includeCustomFields) {
      query += `
          customFields {
            id
            name
            value
          }`;
    }

    query += `
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`;

    const response = await this.jobber.post({
      $,
      data: {
        query,
        operationName: "SearchQuotes",
      },
    });

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    const quotes = response.data.quotes.nodes;
    const count = quotes.length;

    $.export("$summary", `Found ${count} quote${count !== 1
      ? "s"
      : ""}`);
    return response.data.quotes;
  },
};
