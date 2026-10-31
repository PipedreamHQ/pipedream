// x-pd-ai: optimized
import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-get-search-queries",
  name: "Get Search Queries",
  description: "Pull search analytics for your documentation, including query terms, hit counts, and click-through rates. Pass the response's `nextCursor` back into `Cursor` to fetch the next page. Limited to 100 requests per organization per hour, shared across all analytics endpoints. [See the documentation](https://www.mintlify.com/docs/api-reference/analytics/searches)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mintlify,
    dateFrom: {
      propDefinition: [
        mintlify,
        "dateFrom",
      ],
    },
    dateTo: {
      propDefinition: [
        mintlify,
        "dateTo",
      ],
    },
    limit: {
      propDefinition: [
        mintlify,
        "limit",
      ],
      description: "Maximum number of results to return per page, 1-100. Defaults to 50.",
    },
    cursor: {
      propDefinition: [
        mintlify,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.getSearchQueries({
      $,
      params: {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        limit: this.limit,
        cursor: this.cursor,
      },
    });

    const count = response.searches?.length;
    $.export("$summary", `Retrieved ${count} search quer${count === 1
      ? "y"
      : "ies"} out of ${response.totalSearches} total`);

    return response;
  },
};
