import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-employees",
  name: "List Employees",
  description: "List employees with optional filtering, sorting, and cursor-based pagination (GET /employees). Every record includes `employeeId`, `firstName`, `lastName`, `preferredName`, `photoUrl`, `jobTitleName`, `status`, and `_restrictedFields` by default; use `fields` for more. Restricted fields you can't read return `null` and are listed in `_restrictedFields`. [See the documentation](https://documentation.bamboohr.com/reference/list-employees)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    bamboohr,
    filter: {
      type: "object",
      label: "Filter",
      description: "Filter employees by field as name-value pairs, e.g. `{\"status\":\"Active\",\"lastName\":\"Doe\"}`. Names/addresses match by substring; IDs, enums, and dates match by equality. Use the special `ids` key with a comma-separated list to filter to specific employee IDs, e.g. `{\"ids\":\"100,101,102\"}`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Comma-separated sort over `employeeId`, `firstName`, `lastName`, `preferredName`, `jobTitleName`, `status`; prefix a field with `-` for descending, e.g. `-lastName,firstName`.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated additional fields to include beyond the defaults, e.g. `workEmail,mobilePhone,departmentName`.",
      optional: true,
    },
    pageLimit: {
      type: "integer",
      label: "Page Limit",
      description: "Maximum records to return. Min 1, max 2500 (default 250).",
      min: 1,
      max: 2500,
      optional: true,
    },
    pageAfter: {
      type: "string",
      label: "Page After",
      description: "Cursor to fetch the next page, from the previous response's `meta.page.nextCursor`.",
      optional: true,
    },
    pageBefore: {
      type: "string",
      label: "Page Before",
      description: "Cursor to fetch the previous page, from the previous response's `meta.page.prevCursor`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "sort": this.sort,
      "fields": this.fields,
      "page[limit]": this.pageLimit,
      "page[after]": this.pageAfter,
      "page[before]": this.pageBefore,
    };
    for (const [
      key,
      value,
    ] of Object.entries(this.filter ?? {})) {
      params[`filter[${key}]`] = value;
    }
    const response = await this.bamboohr.listEmployees({
      $,
      params,
    });
    const employees = response?.data ?? [];
    $.export("$summary", `Retrieved ${employees.length} employee${employees.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
