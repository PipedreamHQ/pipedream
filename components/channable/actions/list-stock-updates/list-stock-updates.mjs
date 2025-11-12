import channable from "../../channable.app.mjs";

export default {
  key: "channable-list-stock-updates",
  name: "List Stock Updates",
  description: "List stock updates for a company and project. [See the documentation](https://api.channable.com/v1/docs#tag/stock_updates/operation/get_stock_updates_companies__company_id__projects__project_id__offers_get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    channable,
    search: {
      type: "string",
      label: "Search",
      description: "A text based search query",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the stock updates",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the stock updates",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "The maximum number of stock updates to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const stockUpdates = await this.channable.getPaginatedResources({
      fn: this.channable.listStockUpdates,
      args: {
        $,
        params: {
          search: this.search,
          start_date: this.startDate,
          end_date: this.endDate,
        },
        max: this.max,
      },
      resourceKey: "offers",
    });
    $.export("$summary", `Found ${stockUpdates.length} stock update${stockUpdates.length === 1
      ? ""
      : "s"}`);
    return stockUpdates;
  },
};
