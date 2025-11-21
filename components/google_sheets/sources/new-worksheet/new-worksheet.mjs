import sampleEmit from "./test-event.mjs";

export default {
  key: "google_sheets-new-worksheet",
  type: "source",
  name: "New Worksheet (Polling)",
  description: "Emit new event each time a new worksheet is created in a spreadsheet.",
  version: "0.3.0",
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
    spreadsheet_id: {
      type: "string",
      label: "Spreadsheet ID",
      description: "The Google Sheets spreadsheet ID",
    },
  },
  methods: {
    async getSpreadsheetMetadata() {
      const { google_sheets } = this;
      const { spreadsheet_id } = this;

      const response = await google_sheets.request({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}`,
        method: "GET",
        params: {
          fields: "sheets(properties(sheetId,title,index,sheetType,gridProperties),data(rowData(values(userEnteredValue))))",
        },
      });

      return response;
    },

    async getSheets() {
      const metadata = await this.getSpreadsheetMetadata();
      return metadata.sheets || [];
    },

    formatSheetData(sheet) {
      const { properties } = sheet;
      return {
        sheet_id: properties.sheetId,
        title: properties.title,
        index: properties.index,
        sheet_type: properties.sheetType || "GRID",
        grid_properties: properties.gridProperties,
        created_at: new Date().toISOString(),
      };
    },

    getStoredSheetIds() {
      const {
        spreadsheet_id,
        db,
      } = this;
      const stateKey = `sheets-${spreadsheet_id}`;
      return db.get(stateKey) || [];
    },

    updateStoredSheetIds(sheetIds) {
      const {
        spreadsheet_id,
        db,
      } = this;
      const stateKey = `sheets-${spreadsheet_id}`;
      db.set(stateKey, sheetIds);
    },
  },
  async run() {
    const { spreadsheet_id } = this;

    try {
      const sheets = await this.getSheets();
      const currentSheetIds = sheets.map((s) => s.properties.sheetId);
      const storedSheetIds = this.getStoredSheetIds();

      const newSheets = sheets.filter(
        (sheet) => !storedSheetIds.includes(sheet.properties.sheetId),
      );

      if (newSheets.length > 0) {
        newSheets.forEach((sheet) => {
          const formattedSheet = this.formatSheetData(sheet);

          this.$emit(
            {
              ...formattedSheet,
              spreadsheet_id,
              timestamp: new Date().toISOString(),
            },
            {
              id: `${spreadsheet_id}-${sheet.properties.sheetId}`,
              summary: `New worksheet created: ${sheet.properties.title}`,
              ts: Date.now(),
            },
          );
        });

        this.updateStoredSheetIds(currentSheetIds);
      } else if (storedSheetIds.length === 0) {
        this.updateStoredSheetIds(currentSheetIds);
      }
    } catch (error) {
      console.error(`Error fetching spreadsheet metadata: ${error.message}`);
      throw error;
    }
  },
  sampleEmit,
};
