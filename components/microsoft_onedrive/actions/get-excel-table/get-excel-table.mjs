import httpRequest from "../../common/httpRequest.mjs";
import onedrive from "../../microsoft_onedrive.app.mjs";

export default {
  name: "Get Table",
  description: "Retrieve a table from an Excel spreadsheet stored in OneDrive [See the documentation](https://learn.microsoft.com/en-us/graph/api/table-range?view=graph-rest-1.0&tabs=http)",
  key: "microsoft_onedrive-get-excel-table",
  version: "0.0.4",
  type: "action",
  props: {
    onedrive,
    itemId: {
      type: "string",
      label: "Spreadsheet",
      description: "Search for the file by name, only xlsx files are supported",
      useQuery: true,
      async options( context ) {
        const response = await this.httpRequest({
          $: context,
          url: `/search(q='${context?.query ?? ""} .xlsx')?select=name,id`,
        });
        return response.value
          .filter(({ name }) => name.endsWith(".xlsx"))
          .map(({
            name, id,
          }) => ({
            label: name,
            value: id,
          }));
      },
    },
    tableName: {
      type: "string",
      label: "Table name",
      description: "This is set in the **Table Design** tab of the ribbon.",
      async options( context ) {
        const response = await this.httpRequest({
          $: context,
          url: `/items/${this.itemId}/workbook/tables?$select=name`,
        });
        return response.value.map(({ name }) => name);
      },
    },
    removeHeaders: {
      type: "boolean",
      label: "Remove headers?",
      optional: true,
      description: "By default, The headers are included as the first row.",
      default: false,
    },
    numberOfRows: {
      type: "integer",
      optional: true,
      default: 0,
      min: 0,
      label: "Number of rows to return",
      description: "Leave blank to return all rows.",
    },
  },
  methods: {
    httpRequest,
  },
  async run({ $ }) {
    const range = await this.httpRequest({
      $,
      url: `/items/${this.itemId}/workbook/tables/${this.tableName}/range`,
    });

    return this.removeHeaders
      ? this.numberOfRows <= 0
        ? range.text.slice(1)
        : range.text.slice(1, this.numberOfRows + 1)
      : this.numberOfRows <= 0
        ? range.text
        : range.text.slice(0, this.numberOfRows + 1);
  },
};
