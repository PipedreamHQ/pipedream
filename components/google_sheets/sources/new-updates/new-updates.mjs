import sampleEmit from "./test-event.mjs";

export default {
  key: "google_sheets-new-updates",
  type: "source",
  name: "New Updates (Polling)",
  description: "Emit new event each time a row or cell is updated in a spreadsheet.",
  version: "0.4.0",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    google_sheets: {
      type: "app",
      app: "google_sheets",
      label: "Google Sheets",
      description: "Google Sheets account to access spreadsheets",
    },
    sheet_name: {
      type: "string",
      label: "Sheet Name",
      description: "The name of the sheet to monitor (e.g., 'Sheet1')",
    },
  },
  methods: {
    async getSheetData() {
      const { google_sheets } = this;
      const {
        spreadsheet_id,
        sheet_name,
      } = this;

      const response = await google_sheets.request({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${encodeURIComponent(sheet_name)}`,
        method: "GET",
      });

      return response.values || [];
    },

    async getLastModifiedTime() {
      const { google_sheets } = this;
      const { spreadsheet_id } = this;

      const response = await google_sheets.request({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}`,
        method: "GET",
        params: {
          fields: "spreadsheet_metadata.last_update_time",
        },
      });

      return response.spreadsheet_metadata?.last_update_time;
    },

    async getAllSheetMetadata() {
      const { google_sheets } = this;
      const { spreadsheet_id } = this;

      const response = await google_sheets.request({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}`,
        method: "GET",
        params: {
          fields: "sheets(properties(sheetId,title))",
        },
      });

      return response.sheets || [];
    },

    async getDetailedChangeData(previousData) {
      const currentData = await this.getSheetData();
      const changes = [];

      const maxRows = Math.max(previousData.length, currentData.length);

      for (let i = 0; i < maxRows; i++) {
        const prevRow = previousData[i] || [];
        const currRow = currentData[i] || [];
        const maxCols = Math.max(prevRow.length, currRow.length);

        for (let j = 0; j < maxCols; j++) {
          const prevCell = prevRow[j] || "";
          const currCell = currRow[j] || "";

          if (prevCell !== currCell) {
            changes.push({
              row: i + 1,
              column: j + 1,
              column_letter: this.getColumnLetter(j + 1),
              previous_value: prevCell,
              current_value: currCell,
            });
          }
        }
      }

      return {
        current_data: currentData,
        changes,
        timestamp: new Date().toISOString(),
        row_count: currentData.length,
        column_count:
          currentData.length > 0
            ? currentData[0].length
            : 0,
      };
    },

    getColumnLetter(colNumber) {
      let letter = "";
      while (colNumber > 0) {
        colNumber--;
        letter = String.fromCharCode(65 + (colNumber % 26)) + letter;
        colNumber = Math.floor(colNumber / 26);
      }
      return letter;
    },
  },
  async run() {
    const {
      spreadsheet_id,
      sheet_name,
      db,
    } = this;

    const stateKey = `${spreadsheet_id}-${sheet_name}`;
    const previousData = db.get(stateKey) || [];

    try {
      const changeData = await this.getDetailedChangeData(previousData);
      const currentData = changeData.current_data;

      if (changeData.changes.length > 0) {
        db.set(stateKey, currentData);

        this.$emit(changeData, {
          id: `${stateKey}-${changeData.timestamp}`,
          summary: `${changeData.changes.length} cell(s) updated`,
          ts: Date.parse(changeData.timestamp),
        });
      }
    } catch (error) {
      console.error(`Error fetching sheet data: ${error.message}`);
      throw error;
    }
  },
  sampleEmit,
};
