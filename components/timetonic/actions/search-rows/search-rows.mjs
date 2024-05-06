import timetonic from "../../timetonic.app.mjs";

export default {
  key: "timetonic-search-rows",
  name: "Search Rows",
  description: "Perform a search across table rows based on given criteria. [See the documentation](https://timetonic.com/live/apidoc/#api-Smart_table_operations-listTableRowsById)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timetonic,
    bookCode: {
      propDefinition: [
        timetonic,
        "bookCode",
      ],
    },
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
        (c) => ({
          bookCode: c.bookCode,
        }),
      ],
    },
    searchField: {
      propDefinition: [
        timetonic,
        "fieldId",
        (c) => ({
          bookCode: c.bookCode,
          tableId: c.tableId,
        }),
      ],
    },
    searchValue: {
      type: "string",
      label: "Search value",
      description: "The value to search for",
    },
  },
  methods: {
    findMatches(fields) {
      const field = fields.find(({ id }) => id === this.searchField);
      return field.values.filter(({ value }) => value == this.searchValue).map(({ id }) => id);
    },
    buildRow(fields, matches) {
      const rows = [];
      matches.forEach((match) => {
        const row = {};
        fields.forEach((field) => {
          row[field.name] = field.values.find(({ id }) => id === match).value;
        });
        rows.push(row);
      });
      return rows;
    },
  },
  async run({ $ }) {
    const { tableValues: { fields } } = await this.timetonic.getTableValues({
      $,
      params: {
        catId: this.tableId,
        b_c: this.bookCode,
      },
    });
    const matches = this.findMatches(fields);
    const rows = this.buildRow(fields, matches);
    $.export("$summary", `Found ${rows.length} matching row${rows.length === 1
      ? ""
      : "s"}`);
    return rows;
  },
};
