import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import {
  BORDER_SIDES, CONTENT_ALIGNMENTS, DASH_STYLES, DEFAULT_DASH_STYLE, POINTS,
} from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-format-table-cell",
  name: "Format Table Cell",
  description: "Set the background, borders, padding, or vertical alignment of table cells in a Google Doc. Identify the table with **Find Table Text**, **Table Index**, or leave both blank when the document has only one table. Styles every cell unless **Row Index** and **Column Index** name a starting cell. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateTableCellStyleRequest)",
  version: "0.0.2",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    find: {
      type: "string",
      label: "Find Table Text",
      description: "Text appearing in a cell of the table to style. The action locates the table containing the first match. Only top-level tables are searched.",
      optional: true,
    },
    matchCase: {
      propDefinition: [
        googleDocs,
        "matchCase",
      ],
    },
    tableIndex: {
      type: "integer",
      label: "Table Index",
      description: "0-based position of the table in the document, in document order. An alternative to **Find Table Text**.",
      min: 0,
      optional: true,
    },
    tableStartIndex: {
      type: "integer",
      label: "Table Start Index",
      description: "Character index the table starts at. An escape hatch for callers that already know it; prefer **Find Table Text** or **Table Index**.",
      min: 1,
      optional: true,
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "styleTabId",
      ],
    },
    rowIndex: {
      type: "integer",
      label: "Row Index",
      description: "0-based row of the first cell to style. Omit (with **Column Index**) to style every cell in the table.",
      min: 0,
      optional: true,
    },
    columnIndex: {
      type: "integer",
      label: "Column Index",
      description: "0-based column of the first cell to style. Omit (with **Row Index**) to style every cell in the table.",
      min: 0,
      optional: true,
    },
    rowSpan: {
      type: "integer",
      label: "Row Span",
      description: "Number of rows to cover, starting at **Row Index**. Defaults to 1.",
      min: 1,
      optional: true,
    },
    columnSpan: {
      type: "integer",
      label: "Column Span",
      description: "Number of columns to cover, starting at **Column Index**. Defaults to 1.",
      min: 1,
      optional: true,
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "Cell background as a hex code, e.g. `#EEEEEE`.",
      optional: true,
    },
    borderColor: {
      type: "string",
      label: "Border Color",
      description: "Border color as a hex code, applied to all four sides. Must be set together with **Border Width**, since the API replaces a cell border as a whole. Borders cannot be transparent; set **Border Width** to `0` to hide one.",
      optional: true,
    },
    borderWidth: {
      type: "integer",
      label: "Border Width",
      description: "Border thickness in points, applied to all four sides (0-100). `0` hides the border. Must be set together with **Border Color**.",
      min: 0,
      max: 100,
      optional: true,
    },
    borderDashStyle: {
      type: "string",
      label: "Border Dash Style",
      description: "Dash pattern for the border, applied to all four sides. Defaults to `SOLID` when a border is set without one.",
      options: DASH_STYLES,
      optional: true,
    },
    paddingTop: {
      type: "integer",
      label: "Padding Top",
      description: "Space between the cell's top edge and its content, in points (0-100).",
      min: 0,
      max: 100,
      optional: true,
    },
    paddingBottom: {
      type: "integer",
      label: "Padding Bottom",
      description: "Space between the cell's bottom edge and its content, in points (0-100).",
      min: 0,
      max: 100,
      optional: true,
    },
    paddingLeft: {
      type: "integer",
      label: "Padding Left",
      description: "Space between the cell's left edge and its content, in points (0-100).",
      min: 0,
      max: 100,
      optional: true,
    },
    paddingRight: {
      type: "integer",
      label: "Padding Right",
      description: "Space between the cell's right edge and its content, in points (0-100).",
      min: 0,
      max: 100,
      optional: true,
    },
    contentAlignment: {
      type: "string",
      label: "Content Alignment",
      description: "Vertical alignment of the content within the cells.",
      options: CONTENT_ALIGNMENTS,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleDocs,
      documentId,
      find,
      matchCase,
      tableIndex,
      tableStartIndex,
      tabId,
      rowIndex,
      columnIndex,
      rowSpan,
      columnSpan,
      backgroundColor,
      borderColor,
      borderWidth,
      borderDashStyle,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      contentAlignment,
    } = this;

    const builder = utils.styleBuilder();

    if (backgroundColor) {
      const color = utils.hexToOptionalColor(backgroundColor);
      if (!color) {
        throw new ConfigurationError(`Background Color "${backgroundColor}" is not a valid hex color. Use a 6-digit hex code such as \`#EEEEEE\`.`);
      }
      builder.set("backgroundColor", color);
    }

    // The Docs API rejects a mask that names a subfield of a border side, so a
    // border can only be replaced whole. Anything left out of that replacement
    // is cleared, and an absent dash style arrives as DASH_STYLE_UNSPECIFIED
    // which is not valid for a border. Colour and width are therefore required
    // together, and the dash style falls back to the API's documented default.
    if (borderColor || borderWidth != null || borderDashStyle) {
      if (!borderColor || borderWidth == null) {
        throw new ConfigurationError("Border Color and Border Width must be set together. The Docs API replaces a cell border as a whole, so setting only part of it would clear the rest.");
      }
      const color = utils.hexToOptionalColor(borderColor);
      if (!color) {
        throw new ConfigurationError(`Border Color "${borderColor}" is not a valid hex color. Use a 6-digit hex code such as \`#000000\`.`);
      }
      const border = {
        color,
        width: {
          magnitude: borderWidth,
          unit: POINTS,
        },
        dashStyle: borderDashStyle || DEFAULT_DASH_STYLE,
      };
      BORDER_SIDES.forEach((side) => builder.set(side, {
        ...border,
      }));
    }

    builder.setDimension("paddingTop", paddingTop);
    builder.setDimension("paddingBottom", paddingBottom);
    builder.setDimension("paddingLeft", paddingLeft);
    builder.setDimension("paddingRight", paddingRight);
    builder.set("contentAlignment", contentAlignment);

    if (builder.isEmpty) {
      throw new ConfigurationError("Provide at least one formatting option (for example Background Color, Border Width, or Padding Top).");
    }
    if ((rowIndex == null) !== (columnIndex == null)) {
      throw new ConfigurationError("Row Index and Column Index must be provided together.");
    }
    if (rowIndex == null && (rowSpan != null || columnSpan != null)) {
      throw new ConfigurationError("Row Span and Column Span need a starting cell. Provide Row Index and Column Index, or omit all four to style the whole table.");
    }

    const tableStartLocation = await googleDocs.resolveTableLocation(documentId, {
      find,
      matchCase,
      tableIndex,
      tableStartIndex,
      tabId,
    });

    // Omitting tableRange is what the API treats as "every cell in the table".
    const target = rowIndex == null
      ? {
        tableStartLocation,
      }
      : {
        tableRange: {
          tableCellLocation: {
            tableStartLocation,
            rowIndex,
            columnIndex,
          },
          rowSpan: rowSpan ?? 1,
          columnSpan: columnSpan ?? 1,
        },
      };

    await googleDocs.batchUpdate(documentId, [
      {
        updateTableCellStyle: {
          ...target,
          tableCellStyle: builder.style,
          fields: builder.mask,
        },
      },
    ]);

    const scope = target.tableRange
      ? `${rowSpan ?? 1}x${columnSpan ?? 1} block from row ${rowIndex}, column ${columnIndex}`
      : "every cell";
    $.export("$summary", `Formatted ${scope} of the table at index ${tableStartLocation.index} in document ${documentId}`);

    return {
      documentId,
      tableStartLocation,
      fieldsUpdated: builder.fields,
      ...target,
    };
  },
};
