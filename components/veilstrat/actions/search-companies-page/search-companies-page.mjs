import app from "../../veilstrat.app.mjs";

export default {
  key: "veilstrat-search-companies-page",
  name: "Search Companies Page",
  description: "Search one bounded page of companies using funding, AI hiring and technology signals. Use **Get Filter Catalog** to discover supported query rules. Returns pagination metadata without automatically spending quota on more pages. [See the documentation](https://app.veilstrat.com/docs/api/endpoints)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    signalQuery: {
      "type": "string",
      "label": "Signal Query",
      "description": "A supported signal query, for example `signal:hiring:30d`. Use Get Filter Catalog for current rules.",
    },
    countries: {
      propDefinition: [
        app,
        "countries",
      ],
    },
    page: {
      "type": "integer",
      "label": "Page",
      "description": "One-based page number. The record offset must remain below 500.",
      "default": 1,
      "min": 1,
      "max": 500,
      "optional": true,
    },
    pageSize: {
      "type": "integer",
      "label": "Page Size",
      "description": "Records to request on this page, from 1 to 50. Each returned record may consume your plan budget.",
      "default": 10,
      "min": 1,
      "max": 50,
      "optional": true,
    },
  },
  async run({ $ }) {
    const result = await this.app.searchCompanies({
      $,
      signalQuery: this.signalQuery,
      countries: this.countries,
      page: this.page,
      pageSize: this.pageSize,
    });
    $.export("$summary", "Retrieved one company search page");
    return result;
  },
};
