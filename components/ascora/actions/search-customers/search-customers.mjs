import ascora from "../../ascora.app.mjs";

export default {
  key: "ascora-search-customers",
  name: "Search Customers",
  description: "Search for customers. [See the documentation](https://www.ascora.com.au/Assets/Guides/AscoraApiGuide.pdf)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ascora,
    query: {
      type: "string",
      label: "Query",
      description: "Search query",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number",
      optional: true,
      default: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Page size",
      optional: true,
      default: 10,
    },
  },
  async run({ $ }) {
    const response = await this.ascora.searchCustomers({
      $,
      params: {
        FilterText: this.query,
        Page: this.page,
        PageSize: this.pageSize,
      },
    });

    $.export("$summary", `Successfully fetched ${response.results?.length ?? 0} customer${response.results?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
