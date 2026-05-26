import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-search-trips",
  name: "Search Trips",
  description: "Finds trips by user, status, or name. [See the documentation](https://developers.rydoo.com/reference/v2tripsgettrips)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rydoo,
    userId: {
      propDefinition: [
        rydoo,
        "userId",
      ],
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Filter trips where the name contains this string",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter by one or more trip statuses",
      optional: true,
      options: [
        "Created",
        "Controlled",
      ],
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Filter by active trips (`true`) or inactive trips (`false`). Defaults to all trips",
      optional: true,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Return trips whose end date is on or after this date (ISO 8601, e.g., `2024-01-01T00:00:00Z`)",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Return trips whose start date is on or before this date (ISO 8601, e.g., `2024-12-31T23:59:59Z`)",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the results by",
      optional: true,
      options: [
        "name",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of trips to return per page (defaults to `50`)",
      optional: true,
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of trips to skip for paging (defaults to `0`)",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.listTrips({
      $,
      params: {
        userId: this.userId,
        search: this.search,
        status: this.status,
        isActive: this.isActive,
        fromDate: this.fromDate,
        toDate: this.toDate,
        sort: this.sort,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const trips = response?.data || response;
    const count = Array.isArray(trips)
      ? trips.length
      : 0;
    $.export("$summary", `Successfully found ${count} trip${count === 1
      ? ""
      : "s"}.`);

    return response;
  },
};
