import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-get-excel-table",
  name: "Get Excel Table",
  description: "Retrieve a table from an Excel spreadsheet stored in Sharepoint [See the documentation](https://learn.microsoft.com/en-us/graph/api/table-range?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    alert: {
      type: "alert",
      alertType: "info",
      content: `Note: The table must exist within the Excel spreadsheet.
        \nSee Microsoft's documentation on how to [Create and Format a Table](https://support.microsoft.com/en-us/office/create-and-format-tables-e81aa349-b006-4f8a-9806-5af9df0ac664)
      `,
    },
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
    },
    itemId: {
      propDefinition: [
        sharepoint,
        "excelFileId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    tableName: {
      propDefinition: [
        sharepoint,
        "tableName",
        (c) => ({
          siteId: c.siteId,
          itemId: c.itemId,
        }),
      ],
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
  async run({ $ }) {
    const range = await this.sharepoint.getExcelTable({
      $,
      siteId: this.siteId,
      itemId: this.itemId,
      tableName: this.tableName,
    });

    const response = this.removeHeaders
      ? this.numberOfRows <= 0
        ? range.text.slice(1)
        : range.text.slice(1, this.numberOfRows + 1)
      : this.numberOfRows <= 0
        ? range.text
        : range.text.slice(0, this.numberOfRows + 1);

    $.export("$summary", "Successfully retrieved excel table.");

    return response;
  },
};
