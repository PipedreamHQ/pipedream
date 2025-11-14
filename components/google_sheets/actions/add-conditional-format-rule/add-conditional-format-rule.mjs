import googleSheets from "../../google_sheets.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "google_sheets-add-conditional-format-rule",
  name: "Add Conditional Format Rule",
  description: "Create conditional formatting with color scales or custom formulas. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#AddConditionalFormatRuleRequest)",
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
      description: "The range of cells to format (e.g., `A1:A10`)",
    },
    conditionType: {
      type: "string",
      label: "Validation Type",
      description: "The type of data condition",
      options: [
        "ONE_OF_LIST",
        "NUMBER_GREATER",
        "NUMBER_LESS",
        "DATE_BEFORE",
        "DATE_AFTER",
        "TEXT_CONTAINS",
        "TEXT_IS_EMAIL",
        "TEXT_IS_URL",
        "BOOLEAN",
      ],
    },
    conditionValues: {
      type: "string[]",
      label: "Condition Values",
      description: "Values for condition (e.g., color scales or custom formulas)",
    },
    formattingType: {
      type: "string",
      label: "Formatting Type",
      description: "Choose between boolean condition or gradient color scale",
      options: [
        "BOOLEAN_RULE",
        "GRADIENT_RULE",
      ],
      default: "BOOLEAN_RULE",
    },
    rgbColor: {
      type: "object",
      label: "RGB Color",
      description: "The RGB color value (e.g., {\"red\": 1.0, \"green\": 0.5, \"blue\": 0.2})",
      optional: true,
    },
    textFormat: {
      type: "object",
      label: "Text Format",
      description: "The text format options",
      optional: true,
    },
    bold: {
      type: "boolean",
      label: "Bold",
      description: "Whether the text is bold",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "Whether the text is italic",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "Whether the text is strikethrough",
      optional: true,
    },
    interpolationPointType: {
      type: "string",
      label: "Interpolation Point Type",
      description: "The interpolation point type",
      options: [
        "MIN",
        "MAX",
        "NUMBER",
        "PERCENT",
        "PERCENTILE",
      ],
      optional: true,
    },
    index: {
      type: "integer",
      label: "Index",
      description: "The zero-based index of the rule",
    },
  },
  async run({ $ }) {
    const {
      startCol,
      endCol,
      startRow,
      endRow,
    } = this.googleSheets._parseRangeString(`${this.worksheetId}!${this.range}`);

    const rule = {
      ranges: [
        {
          sheetId: this.worksheetId,
          startRowIndex: startRow,
          endRowIndex: endRow,
          startColumnIndex: startCol.charCodeAt(0) - 65,
          endColumnIndex: endCol.charCodeAt(0) - 64,
        },
      ],
    };

    const parseRgbColor = (rgbColor = {}) => {
      if (typeof rgbColor === "string") {
        try {
          rgbColor = JSON.parse(rgbColor);
        } catch {
          throw new ConfigurationError("Could not parse RGB Color. Please provide a valid JSON object.");
        }
      }
      return rgbColor;
    };

    this.formattingType === "GRADIENT_RULE" ?
      rule.gradientRule = {
        minpoint: {
          colorStyle: {
            rgbColor: parseRgbColor(this.rgbColor),
          },
          type: this.interpolationPointType,
          value: "MIN",
        },
        midpoint: {
          colorStyle: {
            rgbColor: parseRgbColor(this.rgbColor),
          },
          type: this.interpolationPointType,
          value: "MID",
        },
        maxpoint: {
          colorStyle: {
            rgbColor: parseRgbColor(this.rgbColor),
          },
          type: this.interpolationPointType,
          value: "MAX",
        },
      } :
      rule.booleanRule = {
        condition: {
          type: this.conditionType,
          values: this.conditionValues?.map((v) => ({
            userEnteredValue: v,
          })) || [],
        },
        format: {
          backgroundColorStyle: {
            rgbColor: parseRgbColor(this.rgbColor),
          },
          textFormat: {
            ...this.textFormat,
            foregroundColorStyle: {
              rgbColor: parseRgbColor(this.rgbColor),
            },
            bold: this.bold,
            italic: this.italic,
            strikethrough: this.strikethrough,
          },
        },
      };

    const request = {
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            addConditionalFormatRule: {
              rule,
              index: this.index,
            },
          },
        ],
      },
    };
    const response = await this.googleSheets.batchUpdate(request);
    $.export("$summary", "Successfully added conditional format rule.");
    return response;
  },
};
