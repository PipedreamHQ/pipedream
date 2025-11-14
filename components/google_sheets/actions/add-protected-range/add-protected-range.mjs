import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-add-protected-range",
  name: "Add Protected Range",
  description: "Add edit protection to cell range with permissions. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#AddProtectedRangeRequest)",
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
    protectedRangeId: {
      type: "integer",
      label: "Protected Range ID",
      description: "The ID of the protected range (required for update and delete operations). This is a unique identifier assigned by Google Sheets",
      optional: true,
    },
    range: {
      propDefinition: [
        googleSheets,
        "range",
      ],
      description: "The range of cells to protect (e.g., `A1:A10`). Required for add and update operations",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the protected range",
      optional: true,
    },
    requestingUserCanEdit: {
      type: "boolean",
      label: "Requesting User Can Edit",
      description: "If true, the user making this request can edit the protected range",
      optional: true,
      default: false,
    },
    protectors: {
      type: "string[]",
      label: "Protectors",
      description: "Email addresses of users/groups who can edit the protected range (e.g., user@example.com)",
      optional: true,
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
            addProtectedRange: {
              protectedRange: {
                protectedRangeId: this.protectedRangeId,
                range: {
                  sheetId: this.worksheetId,
                  startRowIndex: startRow,
                  endRowIndex: endRow,
                  startColumnIndex: startCol.charCodeAt(0) - 65,
                  endColumnIndex: endCol.charCodeAt(0) - 64,
                },
                description: this.description,
                requestingUserCanEdit: this.requestingUserCanEdit,
                editors: {
                  users: this.protectors || [],
                },
              },
            },
          },
        ],
      },
    };
    const response = await this.googleSheets.batchUpdate(request);
    $.export("$summary", "Successfully added protected range.");
    return response;
  },
};
