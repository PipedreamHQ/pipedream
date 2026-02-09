import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "microsoft_excel-new-cell-value-changed",
  name: "New Cell Value Changed",
  description: "Emit new event when when a specific cell's value changes in an Excel worksheet",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    cell: {
      type: "string",
      label: "Cell",
      description: "The address of the cell to watch for changes. E.g. `A1`",
    },
  },
  methods: {
    ...common.methods,
    _getCellValue() {
      return this.db.get("cellValue");
    },
    _setCellValue(value) {
      this.db.set("cellValue", value);
    },
    generateMeta(item) {
      const ts = Date.now();
      return {
        id: `${item.address}${ts}`,
        summary: "Cell value updated",
        ts,
      };
    },
  },
  async run() {
    const previousCellValue = this._getCellValue();

    const response = await this.microsoftExcel.getRange({
      sheetId: this.sheetId,
      worksheet: this.worksheet,
      range: `${this.cell}:${this.cell}`,
    });

    const value = response.values[0][0];

    if (value === previousCellValue) {
      return;
    }

    this._setCellValue(value);
    if (previousCellValue) {
      response.previousValue = previousCellValue;
    }

    this.emitEvent(response);
  },
};
