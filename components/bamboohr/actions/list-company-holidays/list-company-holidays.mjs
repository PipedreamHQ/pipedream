import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-company-holidays",
  name: "List Company Holidays",
  description: "List company holidays with optional OData filtering, sorting, and pagination (GET /holidays). [See the documentation](https://documentation.bamboohr.com/reference/list-company-holidays)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    filter: {
      type: "string",
      label: "Filter",
      description: "OData filter expression over name, startDate, endDate, isPublic, globalHolidayUuid, e.g. `startDate ge '2026-01-01' and endDate le '2026-12-31'`.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Comma-separated sort over name, startDate, endDate, createdAt, updatedAt (default `startDate asc`).",
      optional: true,
    },
    select: {
      type: "string",
      label: "Select",
      description: "Comma-separated field projection, e.g. `id,name,startDate`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number, starting at 1.",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Results per page. Min 1, max 100 (default 20).",
      min: 1,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listCompanyHolidays({
      $,
      params: {
        "filter": this.filter,
        "orderBy": this.orderBy,
        "select": this.select,
        "page": this.page,
        "pageSize": this.pageSize,
      },
    });
    const holidays = response?.data ?? response?.value ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Retrieved ${holidays.length} company holiday${holidays.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
