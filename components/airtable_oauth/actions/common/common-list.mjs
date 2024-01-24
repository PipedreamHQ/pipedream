import airtable from "../../airtable_oauth.app.mjs";

export default {
  props: {
    sortField: {
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

    const data = [];
    const params = {
      returnFieldsByFieldId: this.returnFieldsByFieldId,
    };

    if (viewId) { params.view = viewId; }
    if (this.filterByFormula) { params.filterByFormula = this.filterByFormula; }
    if (this.maxRecords) { params.maxRecords = this.maxRecords; }
    if (this.sortField && this.sortDirection) {
      params["sort[0][field]"] = this.sortField;
      params["sort[0][direction]"] = this.sortDirection;
    }

    do {
      const {
        records, offset,
      } = await this.airtable.listRecords({
        baseId,
        tableId,
        params,
        $,
      });
      data.push(...records);
      params.offset = offset;
    } while (params.offset);

    const l = data.length;
    $.export("$summary", `Fetched ${l} record${l === 1
      ? ""
      // eslint-disable-next-line multiline-ternary
      : "s"} from ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId}${viewId ? `/${viewId}` : ""})`);
    return data;
  },
};
