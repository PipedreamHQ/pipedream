import airtable from "../../airtable_oauth.app.mjs";

export default {
  props: {
    sortFieldId: {
      propDefinition: [
        airtable,
        "sortFieldId",
        ({
          baseId, tableId,
        }) => ({
          baseId: baseId.value,
          tableId: tableId.value,
        }),
      ],
      optional: true,
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
    returnFieldsByFieldId: {
      propDefinition: [
        airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  async run({ $ }) {
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;
    const viewId = this.viewId?.value ?? this.viewId;

    const config = {
      returnFieldsByFieldId: this.returnFieldsByFieldId || false,
    };

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

    const data = await this.airtable.listRecords({
      baseId,
      tableId,
      params: config,
    });

    const l = data.length;
    $.export("$summary", `Fetched ${l} record${l === 1
      ? ""
      // eslint-disable-next-line multiline-ternary
      : "s"} from ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId}${viewId ? `/${viewId}` : ""})`);
    return data;
  },
};
