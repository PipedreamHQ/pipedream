import sampleEmit from "./test-event.mjs";

export default {
  key: "google_sheets-new-row-added",
  type: "source",
  name: "New Row Added (Polling)",
  description:
    "Emit new event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.3.0",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    google_sheets: {
      type: "app",
      app: "google_sheets",
      label: "Google Sheets",
      description: "Google Sheets account used to access the Sheets API",
    },
    spreadsheet_id: {
      type: "string",
      label: "Spreadsheet ID",
      description: "The Google Sheets spreadsheet ID",
    },
    sheet_name: {
      type: "string",
      label: "Sheet Name",
      description: "The name of the sheet to monitor (e.g., 'Sheet1')",
    },
  },
  methods: {
    async getSheetData() {
      const {
        google_sheets,
        spreadsheet_id,
        sheet_name,
      } = this;

      const response = await google_sheets.request({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${encodeURIComponent(sheet_name)}`,
        method: "GET",
      });

      if (response && response.values) {
        return response.values;
      }
      return [];
    },

    async getHeaderRow() {
      const data = await this.getSheetData();
      if (data.length > 0) {
        return data[0];
      }
      return [];
    },

    rowToObject(headers, rowData) {
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = rowData[idx] || "";
      });
      return obj;
    },

    getStoredRowCount() {
      const {
        spreadsheet_id,
        sheet_name,
        db,
      } = this;
      const stateKey = `row-count-${spreadsheet_id}-${sheet_name}`;
      return db.get(stateKey) || 0;
    },

    updateStoredRowCount(count) {
      const {
        spreadsheet_id,
        sheet_name,
        db,
      } = this;
      const stateKey = `row-count-${spreadsheet_id}-${sheet_name}`;
      db.set(stateKey, count);
    },

    getStoredRows() {
      const {
        spreadsheet_id,
        sheet_name,
        db,
      } = this;
      const stateKey = `rows-${spreadsheet_id}-${sheet_name}`;
      return db.get(stateKey) || [];
    },

    updateStoredRows(rows) {
      const {
        spreadsheet_id,
        sheet_name,
        db,
      } = this;
      const stateKey = `rows-${spreadsheet_id}-${sheet_name}`;
      db.set(stateKey, rows);
    },
  },
  async run() {
    const {
      spreadsheet_id,
      sheet_name,
    } = this;

    if (!spreadsheet_id || !sheet_name) {
      throw new Error("Please provide both Spreadsheet ID and Sheet Name");
    }

    try {
      const allData = await this.getSheetData();

      // Sheet must have at least a header row
      if (allData.length === 0) {
        this.updateStoredRowCount(0);
        return;
      }

      const headers = allData[0];
      const currentRows = allData.slice(1); // Exclude header
      const storedRowCount = this.getStoredRowCount();

      // Detect new rows added to the bottom
      if (currentRows.length > storedRowCount) {
        const newRows = currentRows.slice(storedRowCount);

        // Emit event for new rows
        newRows.forEach((rowData, idx) => {
          const rowNumber = storedRowCount + idx + 2; // +2: 1 for header, 1 for 1-indexing
          const rowObject = this.rowToObject(headers, rowData);

          this.$emit(
            {
              row_number: rowNumber,
              values: rowData,
              object: rowObject,
              spreadsheet_id,
              sheet_name,
              timestamp: new Date().toISOString(),
            },
            {
              id: `${spreadsheet_id}-${sheet_name}-row-${rowNumber}`,
              summary: `New row added at row ${rowNumber}`,
              ts: Date.now(),
            },
          );
        });

        // Update stored row count
        this.updateStoredRowCount(currentRows.length);
      } else if (storedRowCount === 0) {
        // First run: store current row count without emitting
        this.updateStoredRowCount(currentRows.length);
      }
    } catch (error) {
      console.error(`Error fetching sheet data: ${error.message}`);
      throw error;
    }
  },
  sampleEmit,
};
