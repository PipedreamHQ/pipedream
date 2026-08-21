// x-pd-ai: optimized
import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-get-page-views",
  name: "Get Page Views",
  description: "Pull page view analytics for your documentation, broken down by page and split into human vs. AI-driven traffic. Limited to 100 requests per organization per hour, shared across all analytics endpoints. Check `hasMore` in the response to know if additional pages of results are available. [See the documentation](https://www.mintlify.com/docs/api-reference/analytics/views)",
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
      description: "Maximum number of results to return per page, 1-250. Defaults to 50.",
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of rows to skip, for pagination. Defaults to 0.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.getPageViews({
      $,
      params: {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Retrieved ${response.views?.length} page(s) — ${response.totals?.total} total views`);

    return response;
  },
};
