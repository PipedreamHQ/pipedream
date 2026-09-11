import googleSheets from "../../google_sheets.app.mjs";
import {
  colorToHex,
  getSheetProperties,
  gridRangeToA1,
  parseA1Range,
  parseColor,
} from "../../common/format-utils.mjs";

/**
 * Agent-facing condition names → the API's ConditionType, plus how many values each
 * one needs. The API's own names (`NUMBER_GREATER_THAN_EQ`, `BLANK`) are easy to get
 * subtly wrong, and a wrong enum is a 400 rather than a recoverable mistake, so the
 * tool owns the translation.
 */
const CONDITIONS = {
  NUMBER_GREATER: {
    type: "NUMBER_GREATER",
    values: 1,
  },
  NUMBER_GREATER_EQ: {
    type: "NUMBER_GREATER_THAN_EQ",
    values: 1,
  },
  NUMBER_LESS: {
    type: "NUMBER_LESS",
    values: 1,
  },
  NUMBER_LESS_EQ: {
    type: "NUMBER_LESS_THAN_EQ",
    values: 1,
  },
  NUMBER_EQ: {
    type: "NUMBER_EQ",
    values: 1,
  },
  NUMBER_BETWEEN: {
    type: "NUMBER_BETWEEN",
    values: 2,
  },
  TEXT_CONTAINS: {
    type: "TEXT_CONTAINS",
    values: 1,
  },
  TEXT_NOT_CONTAINS: {
    type: "TEXT_NOT_CONTAINS",
    values: 1,
  },
  TEXT_EQ: {
    type: "TEXT_EQ",
    values: 1,
  },
  TEXT_STARTS_WITH: {
    type: "TEXT_STARTS_WITH",
    values: 1,
  },
  DATE_BEFORE: {
    type: "DATE_BEFORE",
    values: 1,
  },
  DATE_AFTER: {
    type: "DATE_AFTER",
    values: 1,
  },
  IS_BLANK: {
    type: "BLANK",
    values: 0,
  },
  IS_NOT_BLANK: {
    type: "NOT_BLANK",
    values: 0,
  },
  CUSTOM_FORMULA: {
    type: "CUSTOM_FORMULA",
    values: 1,
  },
  COLOR_SCALE: {
    type: null,
    values: 0,
  },
};

const RELATIVE_DATES = [
  "PAST_YEAR",
  "PAST_MONTH",
  "PAST_WEEK",
  "YESTERDAY",
  "TODAY",
  "TOMORROW",
];

function parseValues(input) {
  if (input === undefined || input === null || input === "") {
    return [];
  }
  if (Array.isArray(input)) {
    return input.map(String);
  }
  const raw = String(input).trim();
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }
    } catch {
      // Fall through to comma splitting — a formula like `=[A1]` isn't JSON.
    }
  }
  // A custom formula can legitimately contain commas, so don't split it.
  if (raw.startsWith("=")) {
    return [
      raw,
    ];
  }
  return raw.split(",").map((v) => v.trim())
    .filter((v) => v !== "");
}

function toConditionValue(value) {
  const upper = String(value).trim()
    .toUpperCase();
  return RELATIVE_DATES.includes(upper)
    ? {
      relativeDate: upper,
    }
    : {
      userEnteredValue: String(value),
    };
}

export default {
  key: "google_sheets-add-conditional-formatting",
  name: "Add Conditional Formatting",
  description:
    "Add a conditional formatting rule to a range in Google Sheets, so cells"
    + " style themselves based on their contents — highlight values over a"
    + " threshold, flag blanks, color-code by text, or apply a red-to-green"
    + " color scale."
    + " Use this when the user wants formatting driven by the data ('highlight"
    + " anything over 100', 'make overdue rows red', 'heat-map the revenue"
    + " column'). For formatting that applies to cells regardless of their"
    + " value, use **Format Cells** instead."
    + " Use **Get Spreadsheet Info** to discover worksheet names and **Read"
    + " Rows** to see the values you're writing a rule against."
    + " `range` is A1 notation WITHOUT the worksheet name (`B2:B100`, `C:C`)."
    + " `values` supplies the numbers/text the condition compares against:"
    + " one value for most conditions, two for `NUMBER_BETWEEN`, none for"
    + " `IS_BLANK`/`IS_NOT_BLANK`/`COLOR_SCALE`, and a formula starting with"
    + " `=` for `CUSTOM_FORMULA`."
    + " Example: to highlight revenue cells above 10000 with a light green"
    + " fill, call with sheetName=\"Financials\", range=\"B2:B100\","
    + " condition=\"NUMBER_GREATER\", values=\"10000\","
    + " backgroundColor=\"light green\" → returns the rule that was created and"
    + " its index on the sheet."
    + " [See the documentation](https://developers.google.com/workspace/sheets/api/samples/conditional-formatting)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleSheets,
    spreadsheetId: {
      type: "string",
      label: "Spreadsheet ID",
      description: "The spreadsheet ID from the Google Sheets URL."
        + " Use **List Spreadsheets** to find it by name.",
    },
    sheetName: {
      type: "string",
      label: "Worksheet Name",
      description: "The worksheet (tab) name. Use **Get Spreadsheet Info**"
        + " to discover worksheet names.",
    },
    range: {
      type: "string",
      label: "Range",
      description: "The cells the rule applies to, in A1 notation and WITHOUT"
        + " the worksheet name. Examples: `B2:B100`, `C:C` (a whole column),"
        + " `A2:F50`. Exclude the header row so the header isn't styled by the"
        + " rule.",
    },
    condition: {
      type: "string",
      label: "Condition",
      description: "What has to be true of a cell for the formatting to apply."
        + " `COLOR_SCALE` is different from the rest: instead of a pass/fail"
        + " test it shades every cell on a gradient from lowest to highest"
        + " value, configured with `minColor`/`midColor`/`maxColor`.",
      options: Object.keys(CONDITIONS),
    },
    values: {
      type: "string",
      label: "Values",
      description: "The value(s) the condition compares against. One value for"
        + " most conditions (`10000`, `Overdue`), two comma-separated values"
        + " for `NUMBER_BETWEEN` (`10,20`), none for `IS_BLANK`,"
        + " `IS_NOT_BLANK` and `COLOR_SCALE`. For `CUSTOM_FORMULA` pass a"
        + " formula starting with `=` that is relative to the first cell of the"
        + " range, e.g. `=$D2=\"Overdue\"`. For `DATE_BEFORE`/`DATE_AFTER`"
        + " pass either a date (`2026-09-01`) or one of `PAST_YEAR`,"
        + " `PAST_MONTH`, `PAST_WEEK`, `YESTERDAY`, `TODAY`, `TOMORROW`.",
      optional: true,
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "Fill color applied to cells that match, as a hex code"
        + " (`#d9ead3`) or a common name (`light green`, `light red`). Not used"
        + " by `COLOR_SCALE`.",
      optional: true,
    },
    textColor: {
      type: "string",
      label: "Text Color",
      description: "Font color applied to cells that match. Not used by"
        + " `COLOR_SCALE`.",
      optional: true,
    },
    bold: {
      type: "boolean",
      label: "Bold",
      description: "Bold the text of cells that match.",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "Italicize the text of cells that match.",
      optional: true,
    },
    minColor: {
      type: "string",
      label: "Min Color",
      description: "`COLOR_SCALE` only — color for the lowest value in the"
        + " range. Defaults to `#ffffff` (white).",
      optional: true,
    },
    midColor: {
      type: "string",
      label: "Mid Color",
      description: "`COLOR_SCALE` only — color for the median (50th"
        + " percentile) value. Omit for a two-color scale.",
      optional: true,
    },
    maxColor: {
      type: "string",
      label: "Max Color",
      description: "`COLOR_SCALE` only — color for the highest value in the"
        + " range. Defaults to `#57bb8a` (green).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spreadsheetId,
      sheetName,
      range: rangeInput,
      condition,
      values,
      backgroundColor,
      textColor,
      bold,
      italic,
      minColor,
      midColor,
      maxColor,
    } = this;

    const spec = CONDITIONS[condition];
    if (!spec) {
      throw new Error(
        `Unknown condition "${condition}". Valid conditions: `
        + `${Object.keys(CONDITIONS).join(", ")}.`,
      );
    }

    const sheetProps = await getSheetProperties(
      this.googleSheets,
      spreadsheetId,
      sheetName,
    );
    const gridRange = {
      sheetId: sheetProps.sheetId,
      ...parseA1Range(rangeInput),
    };
    const a1 = gridRangeToA1(gridRange);

    const rule = {
      ranges: [
        gridRange,
      ],
    };
    const summaryParts = [];

    if (condition === "COLOR_SCALE") {
      const min = parseColor(minColor ?? "#ffffff", "minColor");
      const max = parseColor(maxColor ?? "#57bb8a", "maxColor");
      const mid = parseColor(midColor, "midColor");

      rule.gradientRule = {
        minpoint: {
          colorStyle: {
            rgbColor: min,
          },
          type: "MIN",
        },
        ...mid && {
          midpoint: {
            colorStyle: {
              rgbColor: mid,
            },
            type: "PERCENTILE",
            value: "50",
          },
        },
        maxpoint: {
          colorStyle: {
            rgbColor: max,
          },
          type: "MAX",
        },
      };
      summaryParts.push(
        `color scale ${colorToHex(min)} → ${mid
          ? `${colorToHex(mid)} → `
          : ""}${colorToHex(max)}`,
      );
    } else {
      const parsedValues = parseValues(values);
      if (parsedValues.length !== spec.values) {
        throw new Error(
          `Condition ${condition} needs exactly ${spec.values} value(s) in `
          + `\`values\`, but got ${parsedValues.length}`
          + `${parsedValues.length
            ? ` (${parsedValues.join(", ")})`
            : ""}. `
          + (spec.values === 0
            ? "Leave `values` empty for this condition."
            : spec.values === 2
              ? "Pass two comma-separated values, e.g. `10,20`."
              : condition === "CUSTOM_FORMULA"
                ? "Pass one formula starting with `=`."
                : "Pass a single value."),
        );
      }

      if (condition === "CUSTOM_FORMULA" && !parsedValues[0].startsWith("=")) {
        throw new Error(
          "CUSTOM_FORMULA requires a formula starting with `=`, e.g. "
          + "`=$D2=\"Overdue\"`. Got: "
          + `\`${parsedValues[0]}\`.`,
        );
      }

      const format = {};
      const fill = parseColor(backgroundColor, "backgroundColor");
      if (fill) {
        format.backgroundColorStyle = {
          rgbColor: fill,
        };
        summaryParts.push(`fill ${colorToHex(fill)}`);
      }
      const textFormat = {};
      const foreground = parseColor(textColor, "textColor");
      if (foreground) {
        textFormat.foregroundColorStyle = {
          rgbColor: foreground,
        };
        summaryParts.push(`text ${colorToHex(foreground)}`);
      }
      if (bold !== undefined && bold !== null) {
        textFormat.bold = bold;
        summaryParts.push("bold");
      }
      if (italic !== undefined && italic !== null) {
        textFormat.italic = italic;
        summaryParts.push("italic");
      }
      if (Object.keys(textFormat).length) {
        format.textFormat = textFormat;
      }

      if (!Object.keys(format).length) {
        throw new Error(
          "No formatting was provided for matching cells. Pass at least one of"
          + " backgroundColor, textColor, bold, or italic — otherwise the rule"
          + " would match cells but change nothing.",
        );
      }

      rule.booleanRule = {
        condition: {
          type: spec.type,
          ...parsedValues.length && {
            values: parsedValues.map(toConditionValue),
          },
        },
        format,
      };
    }

    // index 0 puts the new rule first, so it wins over any rule already on the
    // range — which is what a user asking for a highlight expects to see.
    const response = await this.googleSheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addConditionalFormatRule: {
              rule,
              index: 0,
            },
          },
        ],
      },
    });

    $.export(
      "$summary",
      `Added ${condition} conditional formatting to ${a1} on "${sheetName}"`
      + `${summaryParts.length
        ? ` (${summaryParts.join(", ")})`
        : ""}`,
    );

    return {
      spreadsheetId,
      sheetName,
      range: a1,
      condition,
      ruleIndex: 0,
      rule,
      replies: response?.replies,
      spreadsheetUrl:
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
        + `#gid=${sheetProps.sheetId}`,
    };
  },
};
