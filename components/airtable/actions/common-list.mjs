// Shared code for list-* actions
import airtable from "../airtable.app.mjs";

export default {
  props: {
    sortFieldId: {
      propDefinition: [
        airtable,
        "sortFieldId",
        ({
          baseId, tableId,
        }) => ({
          baseId,
          tableId,
        }),
      ],
    },
    sortDirection: {
      propDefinition: [
        airtable,
        "sortDirection",
      ],
    },
    maxRecords: {
      propDefinition: [
        airtable,
        "maxRecords",
      ],
    },
    filterByFormula: {
      propDefinition: [
        airtable,
        "filterByFormula",
      ],
    },
  },
  async run({ $ }) {
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;
    const viewId = this.viewId?.value ?? this.viewId;

    const base = this.airtable.base(baseId);
    const data = [];
    const config = {};

    if (viewId) { config.view = viewId; }
    if (this.filterByFormula) { config.filterByFormula = this.filterByFormula; }
    if (this.maxRecords) { config.maxRecords = this.maxRecords; }
    if (this.sortFieldId && this.sortDirection) {
      config.sort = [
        {
          field: this.sortFieldId,
          direction: this.sortDirection,
        },
      ];
    }

    await base(tableId).select({
      ...config,
    })
      .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
          data.push(record._rawJson);
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      });

    const l = data.length;
    $.export("$summary", `Fetched ${l} record${l === 1
      ? ""
      // eslint-disable-next-line multiline-ternary
      : "s"} from ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId}${viewId ? `/${viewId}` : ""})`);
    return data;
  },
};
