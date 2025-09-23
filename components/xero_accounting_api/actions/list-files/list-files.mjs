import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-list-files",
  name: "List Files",
  description: "List files. [See the documentation](https://developer.xero.com/documentation/api/files/files#get-files)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    xeroAccountingApi,
    pagesize: {
      type: "integer",
      label: "Page Size",
      description: "The number of records returned within a single API call",
      optional: true,
      default: 100,
      min: 1,
      max: 100,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number of the current page in the returned records",
      optional: true,
      default: 1,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the records by",
      optional: true,
      options: [
        "Name",
        "Size",
        "CreatedDateUTC",
      ],
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "The direction to sort the records by",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
  },
  async run({ $ }) {
    const { Items: items } = await this.xeroAccountingApi.listFiles({
      $,
      params: {
        pageSize: this.pagesize,
        page: this.page,
        sort: this.sort,
        direction: this.direction,
      },
    });

    $.export("$summary", `Successfully retrieved ${items.length} file${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
