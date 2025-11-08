import googleSheets from "../../google_sheets.app.mjs";

function rgbToCssColor(red, green, blue) {
  var rgbNumber = (red << 16) | (green << 8) | blue;
  var hexString = rgbNumber.toString(16);
  var missingZeros = 6 - hexString.length;
  var resultBuilder = [
    "#",
  ];
  for (var i = 0; i < missingZeros; i++) {
    resultBuilder.push("0");
  }
  resultBuilder.push(hexString);
  return resultBuilder.join("");
}

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
      description: "The range of cells to protect (e.g., `A1:A10`)",
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
      optional: true,
    },
    conditionValues: {
      type: "string[]",
      label: "Condition Values",
      description: "Values for condition (e.g., color scales or custom formulas)",
      optional: true,
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
    numberFormatType: {
      type: "string",
      label: "Number Format Type",
      description: "The type of number format",
      options: [
        "NUMBER",
        "CURRENCY",
        "PERCENT",
        "SCIENTIFIC",
        "TEXT",
        "TIME",
        "DATE",
        "DATE_TIME",
        "SCIENTIFIC",
      ],
      optional: true,
    },
    rgbColor: {
      type: "object",
      label: "RGB Color",
      description: "The RGB color value (e.g., {red: 1.0, green: 0.5, blue: 0.2})",
      optional: true,
    },
    themeColorType: {
      type: "string",
      label: "Theme Color Type",
      description: "The theme color type",
      options: [
        "TEXT",
        "BACKGROUND",
        "ACCENT1",
        "ACCENT2",
        "ACCENT3",
        "ACCENT4",
        "ACCENT5",
        "ACCENT6",
        "LINK",
      ],
      optional: true,
    },
    borderStyle: {
      type: "string",
      label: "Border Style",
      description: "The border style",
      options: [
        "SOLID",
        "DASHED",
        "DOTTED",
        "DOUBLE",
        "GROOVE",
        "RIDGE",
        "INSET",
        "OUTSET",
      ],
      optional: true,
    },
    topPadding: {
      type: "integer",
      label: "Top Padding",
      description: "The top padding in pixels",
      optional: true,
      default: 0,
    },
    rightPadding: {
      type: "integer",
      label: "Right Padding",
      description: "The right padding in pixels",
      optional: true,
      default: 0,
    },
    bottomPadding: {
      type: "integer",
      label: "Bottom Padding",
      description: "The bottom padding in pixels",
      optional: true,
      default: 0,
    },
    leftPadding: {
      type: "integer",
      label: "Left Padding",
      description: "The left padding in pixels",
      optional: true,
      default: 0,
    },
    horizontalAlign: {
      type: "string",
      label: "Horizontal Align",
      description: "The horizontal alignment",
      options: [
        "LEFT",
        "CENTER",
        "RIGHT",
      ],
      optional: true,
    },
    verticalAlign: {
      type: "string",
      label: "Vertical Align",
      description: "The vertical alignment",
      options: [
        "TOP",
        "MIDDLE",
        "BOTTOM",
      ],
      optional: true,
    },
    wrapStrategy: {
      type: "string",
      label: "Wrap Strategy",
      description: "The wrap strategy",
      options: [
        "OVERFLOW_CELL",
        "LEGACY_WRAP",
        "CLIP",
        "WRAP",
      ],
      optional: true,
    },
    textDirection: {
      type: "string",
      label: "Text Direction",
      description: "The text direction",
      options: [
        "LEFT_TO_RIGHT",
        "RIGHT_TO_LEFT",
      ],
      optional: true,
    },
    textFormat: {
      type: "object",
      label: "Text Format",
      description: "The text format options",
      optional: true,
    },
    fontFamily: {
      type: "string",
      label: "Font Family",
      description: "The font family",
      optional: true,
    },
    fontSize: {
      type: "integer",
      label: "Font Size",
      description: "The font size",
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
    underline: {
      type: "boolean",
      label: "Underline",
      description: "Whether the text is underlined",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "Whether the text is strikethrough",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL for the link",
      optional: true,
    },
    hyperlinkDisplayType: {
      type: "string",
      label: "Hyperlink Display Type",
      description: "The hyperlink display type",
      options: [
        "PLAIN_TEXT",
        "LINKED",
      ],
      optional: true,
    },
    InterpolationPointType: {
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
  async run() {
    const {
      startCol,
      endCol,
      startRow,
      endRow,
    } = this.props.googleSheets._parseRangeString(`${this.props.worksheetId}!${this.props.range}`);

    const rule = {
      range: {
        sheetId: this.props.worksheetId,
        startRowIndex: startRow,
        endRowIndex: endRow,
        startColumnIndex: startCol.charCodeAt(0) - 65,
        endColumnIndex: endCol.charCodeAt(0) - 64,
      },
    };

    const protoToCssColor = (rgbColor) => {
      var redFrac = rgbColor.red || 0.0;
      var greenFrac = rgbColor.green || 0.0;
      var blueFrac = rgbColor.blue || 0.0;
      var red = Math.floor(redFrac * 255);
      var green = Math.floor(greenFrac * 255);
      var blue = Math.floor(blueFrac * 255);

      if (!("alpha" in rgbColor)) {
        return rgbToCssColor(red, green, blue);
      }

      var alphaFrac = rgbColor.alpha.value || 0.0;
      var rgbParams = [
        red,
        green,
        blue,
      ].join(",");
      return [
        "rgba(",
        rgbParams,
        ",",
        alphaFrac,
        ")",
      ]
        .join("");
    };

    this.props.formattingType === "GRADIENT_RULE" ?
      rule.gradientRule = {
        minpoint: {
          interpolationPoint: {
            colorStyle: {
              rgbColor: protoToCssColor(this.props.rgbColor),
              themeColor: {
                type: this.props.themeColorType,
              },
            },
            type: this.props.InterpolationPointType,
            value: "MIN",
          },
        },
        midpoint: {
          interpolationPoint: {
            colorStyle: {
              rgbColor: protoToCssColor(this.props.rgbColor),
              themeColor: {
                type: this.props.themeColorType,
              },
            },
            type: this.props.InterpolationPointType,
            value: "MID",
          },
        },
        maxpoint: {
          interpolationPoint: {
            colorStyle: {
              rgbColor: protoToCssColor(this.props.rgbColor),
              themeColor: {
                type: this.props.themeColorType,
              },
            },
            type: this.props.InterpolationPointType,
            value: "MAX",
          },
        },
      } :
      rule.booleanRule = {
        condition: {
          type: this.props.conditionType,
          values: this.props.conditionValues?.map((v) => ({
            userEnteredValue: v,
          })) || [],
        },
        format: {
          cellFormat: {
            numberFormat: {
              type: this.props.numberFormatType,
            },
            backgroundColorStyle: {
              rgbColor: protoToCssColor(this.props.rgbColor),
              themeColor: {
                type: this.props.themeColorType,
              },
            },
            borders: {
              top: {
                style: this.props.borderStyle,
                colorStyle: {
                  rgbColor: protoToCssColor(this.props.rgbColor),
                  themeColor: {
                    type: this.props.themeColorType,
                  },
                },
              },
              bottom: {
                style: this.props.borderStyle,
                colorStyle: {
                  rgbColor: protoToCssColor(this.props.rgbColor),
                  themeColor: {
                    type: this.props.themeColorType,
                  },
                },
              },
              left: {
                style: this.props.borderStyle,
                colorStyle: {
                  rgbColor: protoToCssColor(this.props.rgbColor),
                  themeColor: {
                    type: this.props.themeColorType,
                  },
                },
              },
              right: {
                style: this.props.borderStyle,
                colorStyle: {
                  rgbColor: protoToCssColor(this.props.rgbColor),
                  themeColor: {
                    type: this.props.themeColorType,
                  },
                },
              },
            },
            padding: {
              top: this.props.topPadding,
              right: this.props.rightPadding,
              bottom: this.props.bottomPadding,
              left: this.props.leftPadding,
            },
            horizontalAlignment: this.props.horizontalAlign,
            verticalAlignment: this.props.verticalAlign,
            wrapStrategy: this.props.wrapStrategy,
            textDirection: this.props.textDirection,
            textFormat: {
              ...this.props.textFormat,
              foregroundColorStyle: {
                rgbColor: this.props.rgbColor,
                themeColor: {
                  type: this.props.themeColorType,
                },
              },
              fontFamily: this.props.fontFamily,
              fontSize: this.props.fontSize,
              bold: this.props.bold,
              italic: this.props.italic,
              underline: this.props.underline,
              strikethrough: this.props.strikethrough,
              link: {
                url: this.props.url,
              },
            },
            hyperlinkDisplayType: this.props.hyperlinkDisplayType,
            textRotation: {
              angle: 0,
              vertical: false,
            },
          },
        },
      };

    const request = {
      spreadsheetId: this.props.sheetId,
      requestBody: {
        requests: [
          {
            addConditionalFormatRuleRequest: {
              rule,
              index: this.props.index,
            },
          },
        ],
      },
    };
    return await this.props.googleSheets.batchUpdate(request);
  },
};
