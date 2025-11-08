import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-delete-conditional-format-rule",
  name: "Delete Conditional Format Rule",
  description: "Remove conditional formatting rule by index. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#DeleteConditionalFormatRuleRequest)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
    index: {
      type: "integer",
      label: "Index",
      description: "The zero-based index of the rule",
    },
  },
  async run() {
    const request = {
      spreadsheetId: this.props.sheetId,
      requestBody: {
        requests: [
          {
            deleteConditionalFormatRuleRequest: {
              sheetId: this.props.worksheetId,
              index: this.props.index,
            },
          },
        ],
      },
    };
    return await this.props.googleSheets.batchUpdate(request);
  },
};
