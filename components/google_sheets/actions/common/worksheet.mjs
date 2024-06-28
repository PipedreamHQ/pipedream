import googleSheets from "../../google_sheets.app.mjs";

export default {
  props: {
    googleSheets,
  },
  methods: {
    async getWorksheetById(sheetId, worksheetId) {
      const { sheets } = await this.googleSheets.getSpreadsheet(sheetId);
      return sheets.find(({ properties: { sheetId } }) => String(sheetId) === String(worksheetId));
    },
  },
};
