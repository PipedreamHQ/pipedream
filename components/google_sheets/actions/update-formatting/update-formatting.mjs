import googleSheets from "../../google_sheets.app.mjs";
import {
  BORDER_STYLES, HORIZONTAL_ALIGNMENTS,
} from "../../common/constants.mjs";

export default {
  key: "google_sheets-update-formatting",
  name: "Update Formatting",
  description: "Update the formatting of a cell in a spreadsheet. [See the documentation](https://developers.google.com/workspace/sheets/api/samples/formatting)",
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
      description: "The drive containing the worksheet to update. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "The spreadsheet containing the worksheet to update",
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
      description: "The range of cells to update. E.g., `A1:A10`",
    },
    backgroundColorRedValue: {
      type: "string",
      label: "Background Color Red Value",
      description: "The amount of red in the color as a value in the interval [0, 1]",
      optional: true,
    },
    backgroundColorGreenValue: {
      type: "string",
      label: "Background Color Green Value",
      description: "The amount of green in the color as a value in the interval [0, 1]",
      optional: true,
    },
    backgroundColorBlueValue: {
      type: "string",
      label: "Background Color Blue Value",
      description: "The amount of blue in the color as a value in the interval [0, 1]",
      optional: true,
    },
    textColorRedValue: {
      type: "string",
      label: "Text Color Red Value",
      description: "The amount of red in the color as a value in the interval [0, 1]",
      optional: true,
    },
    textColorGreenValue: {
      type: "string",
      label: "Text Color Green Value",
      description: "The amount of green in the color as a value in the interval [0, 1]",
      optional: true,
    },
    textColorBlueValue: {
      type: "string",
      label: "Text Color Blue Value",
      description: "The amount of blue in the color as a value in the interval [0, 1]",
      optional: true,
    },
    fontSize: {
      type: "integer",
      label: "Font Size",
      description: "The size of the font",
      optional: true,
    },
    bold: {
      type: "boolean",
      label: "Bold",
      description: "Whether the font should be bold",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "Whether the font should be italic",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "Whether the font should be strikethrough",
      optional: true,
    },
    horizontalAlignment: {
      type: "string",
      label: "Horizontal Alignment",
      description: "The horizontal alignment of the text",
      options: HORIZONTAL_ALIGNMENTS,
      optional: true,
    },
    topBorderStyle: {
      type: "string",
      label: "Top Border Style",
      description: "The style of the top border",
      options: BORDER_STYLES,
      optional: true,
    },
    bottomBorderStyle: {
      type: "string",
      label: "Bottom Border Style",
      description: "The style of the bottom border",
      options: BORDER_STYLES,
      optional: true,
    },
    leftBorderStyle: {
      type: "string",
      label: "Left Border Style",
      description: "The style of the left border",
      options: BORDER_STYLES,
      optional: true,
    },
    rightBorderStyle: {
      type: "string",
      label: "Right Border Style",
      description: "The style of the right border",
      options: BORDER_STYLES,
      optional: true,
    },
    innerHorizontalBorderStyle: {
      type: "string",
      label: "Inner Horizontal Border Style",
      description: "The style of the inner horizontal border",
      options: BORDER_STYLES,
      optional: true,
    },
    innerVerticalBorderStyle: {
      type: "string",
      label: "Inner Vertical Border Style",
      description: "The style of the inner vertical border",
      options: BORDER_STYLES,
      optional: true,
    },
  },
  async run({ $ }) {
    const ASCII_A = 65;    // Unicode (UTF-16) value for the character 'A'
    const OFFSET_INCLUSIVE = -1;  // For making the end column index inclusive
    const {
      startCol,
      endCol,
      startRow,
      endRow,
    } = this.googleSheets._parseRangeString(`${this.worksheetId}!${this.range}`);

    const range = {
      sheetId: this.worksheetId,
      startRowIndex: startRow,
      endRowIndex: endRow,
      startColumnIndex: startCol.charCodeAt(0) - ASCII_A,
      endColumnIndex: endCol.charCodeAt(0) - (ASCII_A + OFFSET_INCLUSIVE),
    };

    const hasBorderStyles = this.topBorderStyle
      || this.bottomBorderStyle
      || this.leftBorderStyle
      || this.rightBorderStyle
      || this.innerHorizontalBorderStyle
      || this.innerVerticalBorderStyle;

    const hasRepeatCellStyles = this.backgroundColorRedValue
      || this.backgroundColorGreenValue
      || this.backgroundColorBlueValue
      || this.textColorRedValue
      || this.textColorGreenValue
      || this.textColorBlueValue
      || this.fontSize
      || this.bold || this.italic || this.strikethrough || this.horizontalAlignment;

    const requests = [];
    if (hasBorderStyles) {
      const updateBorders = {
        range,
      };
      if (this.topBorderStyle) {
        updateBorders.top = {
          style: this.topBorderStyle,
        };
      }
      if (this.bottomBorderStyle) {
        updateBorders.bottom = {
          style: this.bottomBorderStyle,
        };
      }
      if (this.leftBorderStyle) {
        updateBorders.left = {
          style: this.leftBorderStyle,
        };
      }
      if (this.rightBorderStyle) {
        updateBorders.right = {
          style: this.rightBorderStyle,
        };
      }
      if (this.innerHorizontalBorderStyle) {
        updateBorders.innerHorizontal = {
          style: this.innerHorizontalBorderStyle,
        };
      }
      if (this.innerVerticalBorderStyle) {
        updateBorders.innerVertical = {
          style: this.innerVerticalBorderStyle,
        };
      }
      requests.push({
        updateBorders,
      });
    }
    if (hasRepeatCellStyles) {
      const repeatCell = {
        range,
        cell: {
          userEnteredFormat: {},
        },
      };
      const fields = [];
      if (this.backgroundColorRedValue
          || this.backgroundColorGreenValue
          || this.backgroundColorBlueValue
      ) {
        repeatCell.cell.userEnteredFormat.backgroundColor = {};
        fields.push("backgroundColor");
        if (this.backgroundColorRedValue) {
          repeatCell.cell.userEnteredFormat.backgroundColor.red = this.backgroundColorRedValue;
        }
        if (this.backgroundColorGreenValue) {
          repeatCell.cell.userEnteredFormat.backgroundColor.green = this.backgroundColorGreenValue;
        }
        if (this.backgroundColorBlueValue) {
          repeatCell.cell.userEnteredFormat.backgroundColor.blue = this.backgroundColorBlueValue;
        }
      }
      if (this.textColorRedValue || this.textColorGreenValue || this.textColorBlueValue) {
        fields.push("textFormat.foregroundColor");
        repeatCell.cell.userEnteredFormat.textFormat = {
          foregroundColor: {},
        };
        if (this.textColorRedValue) {
          repeatCell.cell.userEnteredFormat.textFormat.foregroundColor.red = this.textColorRedValue;
        }
        if (this.textColorGreenValue) {
          repeatCell.cell.userEnteredFormat.textFormat.foregroundColor.green
            = this.textColorGreenValue;
        }
        if (this.textColorBlueValue) {
          repeatCell.cell.userEnteredFormat.textFormat.foregroundColor.blue
            = this.textColorBlueValue;
        }
      }
      if (this.fontSize || this.bold || this.italic || this.strikethrough) {
        repeatCell.cell.userEnteredFormat.textFormat = {
          ...(repeatCell.cell.userEnteredFormat.textFormat || {}),
        };
      }
      if (this.fontSize) {
        fields.push("textFormat.fontSize");
        repeatCell.cell.userEnteredFormat.textFormat.fontSize = this.fontSize;
      }
      if (this.bold) {
        fields.push("textFormat.bold");
        repeatCell.cell.userEnteredFormat.textFormat.bold = this.bold;
      }
      if (this.italic) {
        fields.push("textFormat.italic");
        repeatCell.cell.userEnteredFormat.textFormat.italic = this.italic;
      }
      if (this.strikethrough) {
        fields.push("textFormat.strikethrough");
        repeatCell.cell.userEnteredFormat.textFormat.strikethrough = this.strikethrough;
      }
      if (this.horizontalAlignment) {
        fields.push("horizontalAlignment");
        repeatCell.cell.userEnteredFormat.horizontalAlignment = this.horizontalAlignment;
      }
      repeatCell.fields = `userEnteredFormat(${fields.join(",")})`;
      requests.push({
        repeatCell,
      });
    }

    const response = await this.googleSheets.sheets().spreadsheets.batchUpdate({
      spreadsheetId: this.sheetId,
      requestBody: {
        requests,
      },
    });
    $.export("$summary", `Updated formatting for range ${this.range}`);
    return response;
  },
};
