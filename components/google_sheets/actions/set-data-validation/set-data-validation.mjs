import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-set-data-validation",
  name: "Set Data Validation",
  description: "Add data validation rules to cells (dropdowns, checkboxes, date/number validation). [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#SetDataValidationRequest)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
    },
    worksheetId: {
      propDefinition: [
        googleSheets,
        "worksheetIDs",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
    },
    range: {
      propDefinition: [
        googleSheets,
        "range",
      ],
      description: "The range of cells to apply validation (e.g., `A1:A10`)",
    },
    validationType: {
      type: "string",
      label: "Validation Type",
      description: "The type of data validation",
      options: [
        "NUMBER_GREATER",
        "NUMBER_GREATER_THAN_EQ",
        "NUMBER_LESS_THAN_EQ",
        "NUMBER_LESS",
        "TEXT_CONTAINS",
        "TEXT_NOT_CONTAINS",
        "DATE_EQUAL_TO",
        "ONE_OF_LIST",
        "DATE_AFTER",
        "DATE_ON_OR_AFTER",
        "DATE_BEFORE",
        "DATE_ON_OR_BEFORE",
        "DATE_BETWEEN",
        "TEXT_STARTS_WITH",
        "TEXT_ENDS_WITH",
        "TEXT_EQUAL_TO",
        "TEXT_NOT_EQUAL_TO",
        "CUSTOM_FORMULA",
        "NUMBER_EQUAL_TO",
        "NUMBER_NOT_EQUAL_TO",
        "NUMBER_BETWEEN",
        "NUMBER_NOT_BETWEEN",
      ],
    },
    validationValues: {
      type: "string[]",
      label: "Validation Values",
      description: "Values for validation (e.g., dropdown options)",
    },
  },
  async run({ $ }) {
    const {
      startCol,
      endCol,
      startRow,
      endRow,
    } = this.googleSheets._parseRangeString(`${this.worksheetId}!${this.range}`);

    const request = {
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            setDataValidation: {
              range: {
                sheetId: this.worksheetId,
                startRowIndex: startRow,
                endRowIndex: endRow,
                startColumnIndex: startCol.charCodeAt(0) - 65,
                endColumnIndex: endCol.charCodeAt(0) - 64,
              },
              rule: {
                condition: {
                  type: this.validationType,
                  values: this.validationValues?.map((v) => ({
                    userEnteredValue: v,
                  })) || [],
                },
                showCustomUi: true,
                strict: true,
              },
            },
          },
        ],
      },
    };
    const response = await this.googleSheets.batchUpdate(request);
    $.export("$summary", "Successfully set data validation.");
    return response;
  },
};
