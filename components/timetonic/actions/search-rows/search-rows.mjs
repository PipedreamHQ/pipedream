import timetonic from "../../timetonic.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "timetonic-search-rows",
  name: "Search Rows",
  description: "Perform a search across table rows based on given criteria. [See the documentation](https://timetonic.com/live/apidoc/#api-Smart_table_operations-listTableRowsById)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.searchField || !this.bookCode || !this.tableId) {
      return props;
    }
    const { tableValues: { fields } } = await this.timetonic.getTableValues({
      params: {
        catId: this.tableId,
        b_c: this.bookCode,
      },
    });
    const field = fields.find(({ id }) => id === this.searchField);
    props.searchValue = {
      type: constants.FIELD_TYPES[field.type] || "string",
      label: "Search Value",
      description: "The value to search for",
    };
    if (field.type === "link") {
      props.searchValue.description = `Please enter the Row ID from ${field.link.category.name} to link to`;
    }
    return props;
  },
  methods: {
    findMatches(fields) {
      const field = fields.find(({ id }) => id === this.searchField);
      let matches;
      if (field.type === "link") {
        matches = field.values.filter(({ value }) =>
          value?.length && value.find((link) => link.row_id == this.searchValue));
      } else {
        matches = field.values.filter(({ value }) => value == this.searchValue);
      }
      return matches.map(({ id }) => id);
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
