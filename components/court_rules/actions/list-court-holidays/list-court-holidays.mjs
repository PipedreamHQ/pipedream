import app from "../../court_rules.app.mjs";

export default {
  key: "court_rules-list-court-holidays",
  name: "List Court Holidays",
  description: "List court holidays and closure dates with the official source URL for each. Filter by court, calendar year or date range. Use it before counting days toward a filing deadline to see which days a court is closed. Use **List Courts** to find the court ID. Leaving Court ID empty returns holidays for every court, which is long, so combine it with a year or date range. [See the documentation](https://docs.courtrules.app/api-reference/holidays)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    districtId: {
      propDefinition: [
        app,
        "districtId",
      ],
      optional: true,
    },
    year: {
      type: "integer",
      label: "Year",
      description: "Only return holidays in this calendar year, e.g. `2026`.",
      min: 1900,
      max: 2200,
      optional: true,
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "Only return holidays on or after this date, in `YYYY-MM-DD` format, e.g. `2026-01-01`.",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "Only return holidays on or before this date, in `YYYY-MM-DD` format, e.g. `2026-12-31`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listCourtHolidays({
      $,
      params: {
        district_id: this.districtId,
        year: this.year,
        date_from: this.dateFrom,
        date_to: this.dateTo,
        limit: this.limit,
      },
    });

    $.export("$summary", `Found ${response.holidays.length} court holiday(s)${this.districtId
      ? ` for ${this.districtId}`
      : ""}`);

    return response;
  },
};
