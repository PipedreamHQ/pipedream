import googleSheets from "../../google_sheets.app.mjs";

export default {
  props: {
    googleSheets,
  },
  methods: {
    async getWorksheetById(sheetId, worksheetId) {
      try {
        const { sheets } = await this.googleSheets.getSpreadsheet(sheetId);
        return sheets
          .find(({ properties: { sheetId } }) => String(sheetId) === String(worksheetId));
      } catch (error) {
        const errorMsg = `Error fetching worksheet with ID \`${worksheetId}\` - ${error.message}`;
        console.log(error);
        throw new Error(errorMsg);
      }
    },
  },
};
