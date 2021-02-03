const crypto = require("crypto")
const common = require("../common");

module.exports = {
  ...common,
  key: "google_sheets-new-updates",
  name: "New Updates (Instant)",
  description:
    "Emits an event each time a row or cell is updated in a spreadsheet.",
  version: "0.0.7",
  dedupe: "unique",
  props: {
    ...common.props,
    sheetID: {
      propDefinition: [
        common.props.google_sheets,
        "sheetID",
        c => ({
          watchedDrive: c.watchedDrive === "myDrive" ? null : c.watchedDrive,
        }),
      ],
    },
    worksheetIDs: {
      propDefinition: [
        common.props.google_sheets,
        "worksheetIDs",
        c => ({ sheetId: c.sheetID }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta(spreadsheet, worksheet, changes) {
      const {
        sheetId: worksheetId,
        title: worksheetTitle,
      } = worksheet.properties;
      const {
        spreadsheetId: sheetId,
        properties: {
          title: sheetTitle,
        },
      } = spreadsheet;

      const changesHash = crypto
        .createHash("md5")
        .update(JSON.stringify(changes))
        .digest("base64");

      const ts = Date.now();
      const id = `${sheetId}${worksheetId}${changesHash}${ts}`;
      const summary = `${sheetTitle} - ${worksheetTitle}`;
      return {
        id,
        summary,
        ts,
      };
    },
    getSheetId() {
      return this.sheetID;
    },
    getWorksheetIds() {
      return this.worksheetIDs;
    },
    getContentChanges(colCount, newValues, oldValues, changes, i) {
      // loop through comparing the values of each cell
      for (let j = 0; j < colCount; j++) {
        let newValue =
          typeof newValues[i] !== "undefined" &&
          typeof newValues[i][j] !== "undefined"
            ? newValues[i][j]
            : "";
        let oldValue =
          typeof oldValues[i] !== "undefined" &&
          typeof oldValues[i][j] !== "undefined"
            ? oldValues[i][j]
            : "";
        if (newValue !== oldValue) {
          changes.push({
            cell: `${String.fromCharCode(j + 65)}:${i + 1}`,
            previous_value: oldValue,
            new_value: newValue,
          });
        }
      }
      return changes;
    },
    getRowCount(newValues, oldValues) {
      // set rowCount to the larger of previous rows or current rows
      return Math.max(newValues.length, oldValues.length);
    },
    getColCount(newValues, oldValues, i) {
      let colCount = 0;
      // set colCount to the larger of previous columns or current columns
      if (
        typeof newValues[i] === "undefined" &&
        typeof oldValues[i] !== "undefined"
      )
        colCount = oldValues[i].length;
      else if (
        typeof oldValues[i] === "undefined" &&
        typeof newValues[i] !== "undefined"
      )
        colCount = newValues[i].length;
      else
        colCount =
          newValues[i].length > oldValues[i].length
            ? newValues[i].length
            : oldValues.length;
      return colCount;
    },
    async getContentDiff(spreadsheet, worksheet) {
      const sheetId = this.getSheetId();
      const oldValues =
        this.db.get(
          `${spreadsheet.spreadsheetId}${worksheet.properties.sheetId}`
        ) || null;
      const currentValues = await this.google_sheets.getSpreadsheetValues(
        sheetId,
        worksheet.properties.title
      );
      return { oldValues, currentValues };
    },
    async takeSheetSnapshot() {
      // Initialize sheet values
      const sheetId = this.getSheetId();
      const worksheetIds = this.getWorksheetIds();
      const sheetValues = await this.google_sheets.getSheetValues(sheetId, worksheetIds);
      for (const sheetVal of sheetValues) {
        const {
          values,
          worksheetId,
        } = sheetVal;
        if (!this.isWorksheetRelevant(worksheetId)) {
          continue;
        }

        this.db.set(`${sheetId}${worksheetId}`, values);
      }
    },
    async processSpreadsheet(spreadsheet) {
      for (const worksheet of spreadsheet.sheets) {
        const { sheetId: worksheetId } = worksheet.properties;
        if (!this.isWorksheetRelevant(worksheetId)) {
          continue;
        }

        const { oldValues, currentValues } = await this.getContentDiff(
          spreadsheet,
          worksheet,
        );
        const newValues = currentValues.values || [];
        let changes = [];
        // check if there are differences in the spreadsheet values
        if (JSON.stringify(oldValues) !== JSON.stringify(newValues)) {
          let rowCount = this.getRowCount(newValues, oldValues);
          for (let i = 0; i < rowCount; i++) {
            let colCount = this.getColCount(newValues, oldValues, i);
            changes = this.getContentChanges(colCount, newValues, oldValues, changes, i);
          }
          this.$emit(
            { worksheet, currentValues, changes },
            this.getMeta(spreadsheet, worksheet, changes),
          );
        }
        this.db.set(
          `${spreadsheet.spreadsheetId}${worksheet.properties.sheetId}`,
          newValues || [],
        );
      }
    },
  },
};
