import googleSheets from "../../google_sheets.app.mjs";

// Helper function to check if a value is a dynamic expression
export const isDynamicExpression = (value) => {
  if (!value || typeof value !== "string") return false;
  return value.trim().startsWith("{{") && value.trim().endsWith("}}");
};

export default {
  props: {
    googleSheets,
    hasHeaders: {
      type: "boolean",
      label: "Does the first row of the sheet have headers?",
      description: "If the first row of your document has headers, we'll retrieve them to make it easy to enter the value for each column. Note: When using a dynamic reference for the worksheet ID (e.g. `{{steps.foo.$return_value}}`), this setting is ignored.",
      reloadProps: true,
    },
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
