import base from "./http-based/base.mjs";
import zlib from "zlib";

/**
 * This module implements logic common to the "New Updates" sources. To create a
 * source with this module, extend  {@linkcode ./http-based/base.mjs base.mjs}
 * or one of its "child" modules (`drive.mjs` or `sheet.mjs`).
 */
export default {
  props: {
    worksheetIDs: {
      propDefinition: [
        base.props.googleSheets,
        "worksheetIDs",
        (c) => ({
          sheetId: c.sheetID,
        }),
      ],
      type: "integer[]",
      label: "Worksheet ID(s)",
      description: "Select one or more worksheet(s), or provide an array of worksheet IDs.",
    },
    maxRows: {
      type: "integer",
      label: "Max Rows to Monitor",
      description: "Maximum number of rows to monitor for changes. Defaults to 10000. Increase with caution as larger values may cause memory issues.",
      optional: true,
      default: 10000,
    },
  },
  methods: {
    getBatchSize() {
      return 1000; // Process 1000 rows at a time
    },
    getMaxRows() {
      return this.maxRows || 10000;
    },
    getMeta(spreadsheet, worksheet) {
      const {
        sheetId: worksheetId,
        title: worksheetTitle,
      } = worksheet.properties;
      const { properties: { title: sheetTitle } } = spreadsheet;

      const ts = Date.now();
      const id = `${worksheetId}${ts}`;
      const summary = `${sheetTitle} - ${worksheetTitle}`;
      return {
        id,
        summary,
        ts,
      };
    },
    /**
     * Temporary transformation to ensure the format of the data is the
     * correct one. This will be fixed in the UI and backend, so that the data
     * format is guaranteed to be the one indicated in the `type` field of the
     * user prop.
     */
    getSheetId() {
      return this.sheetID.toString();
    },
    /**
     * Temporary transformation to ensure the format of the data is the
     * correct one. This will be fixed in the UI and backend, so that the data
     * format is guaranteed to be the one indicated in the `type` field of the
     * user prop.
     */
    getWorksheetIds() {
      return this.worksheetIDs.map((i) => i.toString());
    },
    _getBatchKey(baseId, batchIndex) {
      return `${baseId}_batch_${batchIndex}`;
    },
    _getSheetValues(id) {
      const stringBuffer = this.db.get(id);

      if (!stringBuffer) {
        return;
      }

      const buffer = Buffer.from(stringBuffer, "base64");
      const decompressed = zlib.gunzipSync(buffer);
      return JSON.parse(decompressed);
    },
    _setSheetValues(id, sheetValues) {
      const compressed = zlib.gzipSync(JSON.stringify(sheetValues));
      const stringBuffer = compressed.toString("base64");
      this.db.set(id, stringBuffer);
    },
    _getBatchedSheetValues(baseId) {
      const allValues = [];
      let batchIndex = 0;
      let hasMore = true;

      while (hasMore) {
        const batchKey = this._getBatchKey(baseId, batchIndex);
        const batchValues = this._getSheetValues(batchKey);

        if (!batchValues) {
          hasMore = false;
          break;
        }

        allValues.push(...batchValues);
        batchIndex++;
      }

      return allValues.length > 0
        ? allValues
        : null;
    },
    _setBatchedSheetValues(baseId, sheetValues) {
      const batchSize = this.getBatchSize();
      const maxRows = this.getMaxRows();

      // Limit to maxRows
      const limitedValues = sheetValues.slice(0, maxRows);

      // Clear old batches first
      let batchIndex = 0;
      while (this.db.get(this._getBatchKey(baseId, batchIndex))) {
        this.db.set(this._getBatchKey(baseId, batchIndex), undefined);
        batchIndex++;
      }

      // Store in batches
      batchIndex = 0;
      for (let i = 0; i < limitedValues.length; i += batchSize) {
        const batch = limitedValues.slice(i, i + batchSize);
        const batchKey = this._getBatchKey(baseId, batchIndex);
        this._setSheetValues(batchKey, batch);
        batchIndex++;
      }
    },
    indexToColumnLabel(index) {
      let columnLabel = "";
      while (index >= 0) {
        columnLabel = String.fromCharCode((index % 26) + 65) + columnLabel;
        index = Math.floor(index / 26) - 1;
      }
      return columnLabel;
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
            cell: `${this.indexToColumnLabel(j)}:${i + 1}`,
            previous_value: oldValue,
            new_value: newValue,
          });
        }
      }
      return changes;
    },
    /**
     * Sets rowCount to the larger of previous rows or current rows
     */
    getRowCount(newValues, oldValues) {
      return Math.max(newValues.length, oldValues?.length || 0);
    },
    /**
     * Sets colCount to the larger of previous columns or current columns
     */
    getColCount(newValues, oldValues, i) {
      let colCount = 0;
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
      const baseId = `${spreadsheet.spreadsheetId}${worksheet.properties.sheetId}`;
      const oldValues = this._getBatchedSheetValues(baseId) || null;
      const currentValues = await this.googleSheets.getSpreadsheetValues(
        sheetId,
        worksheet.properties.title,
      );
      return {
        oldValues,
        currentValues,
      };
    },
    async takeSheetSnapshot(offset = 0) {
      // Initialize sheet values
      const sheetId = this.getSheetId();
      const worksheetIds =
        this.getWorksheetIds().length === 0
          ? await this.getAllWorksheetIds(sheetId)
          : this.getWorksheetIds();
      const sheetValues = await this.googleSheets.getSheetValues(
        sheetId,
        worksheetIds,
      );
      for (const sheetVal of sheetValues) {
        const {
          values,
          worksheetId,
        } = sheetVal;
        if (
          this.worksheetIDs.length &&
          !this.isWorksheetRelevant(worksheetId)
        ) {
          continue;
        }

        const maxRows = this.getMaxRows();
        const offsetLength = Math.max(Math.min(values.length, maxRows) - offset, 0);
        const offsetValues = values.slice(0, offsetLength);
        const baseId = `${sheetId}${worksheetId}`;
        this._setBatchedSheetValues(baseId, offsetValues);
      }
    },
    async processSpreadsheet(spreadsheet) {
      for (const worksheet of spreadsheet.sheets) {
        const { sheetId: worksheetId } = worksheet.properties;
        if (
          this.worksheetIDs.length &&
          !this.isWorksheetRelevant(worksheetId)
        ) {
          continue;
        }

        const {
          oldValues,
          currentValues,
        } = await this.getContentDiff(
          spreadsheet,
          worksheet,
        );
        const maxRows = this.getMaxRows();
        const rawNewValues = currentValues.values || [];
        const newValues = rawNewValues.slice(0, maxRows);
        let changes = [];

        // check if there are differences in the spreadsheet values
        if (JSON.stringify(oldValues) !== JSON.stringify(newValues)) {
          let rowCount = this.getRowCount(newValues, oldValues);
          for (let i = 0; i < rowCount; i++) {
            let colCount = this.getColCount(newValues, oldValues, i);
            changes = this.getContentChanges(
              colCount,
              newValues,
              oldValues,
              changes,
              i,
            );
          }
          this.$emit(
            {
              worksheet,
              changes,
            },
            this.getMeta(spreadsheet, worksheet),
          );
        }
        const baseId = `${spreadsheet.spreadsheetId}${worksheet.properties.sheetId}`;
        this._setBatchedSheetValues(baseId, newValues || []);
      }
    },
  },
};
