import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import styling from "../../common/styling.mjs";

export default {
  key: "google_docs-update-table-cell-style",
  name: "Update Table Cell Style",
  description: "Apply cell formatting — background color, borders, padding, or vertical alignment — to one cell, a block of cells, or an entire table in a Google Doc. Leave **Row Index** and **Column Index** blank to restyle the whole table. Only the options you fill in are changed. Use **Get Document** to find the table's start index. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#UpdateTableCellStyleRequest)",
  version: "0.0.1",
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
    tableStartIndex: {
      type: "integer",
      label: "Table Start Index",
      description: "The character index at which the table begins. Use **Get Document** and read the `startIndex` of the element whose `table` field you want to style.",
      min: 1,
    },
    rowIndex: {
      type: "integer",
      label: "Row Index",
      description: "Zero-based index of the first row to style. Leave blank — along with **Column Index** — to style every cell in the table.",
      optional: true,
      min: 0,
    },
    columnIndex: {
      type: "integer",
      label: "Column Index",
      description: "Zero-based index of the first column to style. Leave blank — along with **Row Index** — to style every cell in the table.",
      optional: true,
      min: 0,
    },
    rowSpan: {
      type: "integer",
      label: "Row Span",
      description: "How many rows the styled block covers, starting at **Row Index**. Defaults to `1`. Ignored when styling the whole table.",
      optional: true,
      min: 1,
    },
    columnSpan: {
      type: "integer",
      label: "Column Span",
      description: "How many columns the styled block covers, starting at **Column Index**. Defaults to `1`. Ignored when styling the whole table.",
      optional: true,
      min: 1,
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "Cell background color as a 6-digit hex code (e.g. `#EEEEEE`).",
      optional: true,
    },
    borderColor: {
      type: "string",
      label: "Border Color",
      description: "Border color as a 6-digit hex code (e.g. `#000000`). Applied to all four sides of each cell in range.",
      optional: true,
    },
    borderWidth: {
      type: "integer",
      label: "Border Width",
      description: "Border width in points (e.g. `1`). Applied to all four sides of each cell in range.",
      optional: true,
      min: 0,
    },
    borderDashStyle: {
      type: "string",
      label: "Border Dash Style",
      description: "Border line style. Applied to all four sides of each cell in range.",
      optional: true,
      options: [
        "SOLID",
        "DOT",
        "DASH",
      ],
    },
    paddingTop: {
      type: "integer",
      label: "Padding Top",
      description: "Space between the cell's top border and its content, in points.",
      optional: true,
      min: 0,
    },
    paddingBottom: {
      type: "integer",
      label: "Padding Bottom",
      description: "Space between the cell's bottom border and its content, in points.",
      optional: true,
      min: 0,
    },
    paddingLeft: {
      type: "integer",
      label: "Padding Left",
      description: "Space between the cell's left border and its content, in points.",
      optional: true,
      min: 0,
    },
    paddingRight: {
      type: "integer",
      label: "Padding Right",
      description: "Space between the cell's right border and its content, in points.",
      optional: true,
      min: 0,
    },
    contentAlignment: {
      type: "string",
      label: "Content Alignment",
      description: "How content sits vertically within the cell.",
      optional: true,
      options: [
        "TOP",
        "MIDDLE",
        "BOTTOM",
      ],
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "tabId",
      ],
    },
  },
  methods: {
    // `updateTableCellStyle` targets either a block of cells (`tableRange`) or the
    // whole table (`tableStartLocation`) — never both. Row and column index have to
    // arrive together, since a range anchored on only one axis is meaningless.
    buildTarget() {
      const tableStartLocation = {
        index: this.tableStartIndex,
      };
      if (this.tabId) {
        tableStartLocation.tabId = this.tabId;
      }

      const hasRow = this.rowIndex !== undefined && this.rowIndex !== null;
      const hasColumn = this.columnIndex !== undefined && this.columnIndex !== null;

      if (hasRow !== hasColumn) {
        throw new ConfigurationError("Set both Row Index and Column Index to style a specific block of cells, or leave both blank to style the entire table.");
      }

      if (!hasRow) {
        return {
          tableStartLocation,
        };
      }

      return {
        tableRange: {
          tableCellLocation: {
            tableStartLocation,
            rowIndex: this.rowIndex,
            columnIndex: this.columnIndex,
          },
          rowSpan: this.rowSpan ?? 1,
          columnSpan: this.columnSpan ?? 1,
        },
      };
    },
  },
  async run({ $ }) {
    const target = this.buildTarget();

    // The API models each side separately, but a per-side editor would mean twelve
    // more props for a case the Docs UI itself treats as one control.
    const border = styling.buildStyle({
      color: styling.optionalColor(this.borderColor, "Border Color"),
      width: styling.points(this.borderWidth),
      dashStyle: this.borderDashStyle,
    });
    const sideBorder = border.isEmpty
      ? undefined
      : border.style;

    const {
      style, fields, isEmpty,
    } = styling.buildStyle({
      contentAlignment: this.contentAlignment,
      backgroundColor: styling.optionalColor(this.backgroundColor, "Background Color"),
      borderTop: sideBorder,
      borderBottom: sideBorder,
      borderLeft: sideBorder,
      borderRight: sideBorder,
      paddingTop: styling.points(this.paddingTop),
      paddingBottom: styling.points(this.paddingBottom),
      paddingLeft: styling.points(this.paddingLeft),
      paddingRight: styling.points(this.paddingRight),
    });

    if (isEmpty) {
      throw new ConfigurationError("Set at least one style option (e.g. Background Color, Border Width, or Padding Top) — otherwise there is nothing to update.");
    }

    await this.googleDocs._batchUpdate(this.documentId, "updateTableCellStyle", {
      ...target,
      tableCellStyle: style,
      fields,
    });

    const scope = target.tableRange
      ? `cells at row ${this.rowIndex}, column ${this.columnIndex}`
      : "all cells";
    $.export("$summary", `Updated ${scope} in the table at index ${this.tableStartIndex} of document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId);
  },
};
