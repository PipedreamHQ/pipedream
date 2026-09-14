import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-sheet-id-options",
  name: "List Sheet Options",
  description:
    "Returns a lightweight `{ label, value }` list of sheets the authenticated user can access — just names and IDs,"
    + " one page at a time. Use this when you only need to pick a sheet ID (e.g. to populate a selector);"
    + " for full sheet metadata (owner, permalink, timestamps) use **List Sheets** instead."
    + " Example: call with `page: 0` to get the first page; if you get back a full page of results, call again with"
    + " `page: 1`, `page: 2`, etc. until a shorter (or empty) page is returned."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/list-sheets)",
  version: "0.0.4",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const { data } = await this.smartsheet.listSheets({
      $,
      params: {
        page: this.page + 1,
      },
    });
    const options = (data || []).map(({
      id, name,
    }) => ({
      label: name,
      value: id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
