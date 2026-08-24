import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import styling from "../../common/styling.mjs";

export default {
  key: "google_slides-update-table-cell-properties",
  name: "Update Table Cell Properties",
  description: "Style the cells of a table — background fill and vertical content alignment — across one cell, a block of cells, or the whole table. Leave **Row Index** and **Column Index** blank to style every cell. Only the options you fill in are changed. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdateTableCellPropertiesRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleSlides,
    presentationId: {
      propDefinition: [
        googleSlides,
        "presentationId",
      ],
    },
    slideId: {
      propDefinition: [
        googleSlides,
        "slideId",
        (c) => ({
          presentationId: c.presentationId,
        }),
      ],
    },
    tableId: {
      propDefinition: [
        googleSlides,
        "tableId",
        (c) => ({
          presentationId: c.presentationId,
          slideId: c.slideId,
        }),
      ],
    },
    rowIndex: {
      propDefinition: [
        googleSlides,
        "rowIndex",
      ],
      description: "Zero-based index of the first row to style. Leave blank — along with **Column Index** — to style every cell in the table.",
    },
    columnIndex: {
      propDefinition: [
        googleSlides,
        "columnIndex",
      ],
      description: "Zero-based index of the first column to style. Leave blank — along with **Row Index** — to style every cell in the table.",
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
      propDefinition: [
        googleSlides,
        "backgroundColor",
      ],
      description: "Cell background color as a 6-digit hex code (e.g. `#EEEEEE`).",
    },
    backgroundAlpha: {
      propDefinition: [
        googleSlides,
        "backgroundAlpha",
      ],
      label: "Background Opacity",
      description: "Opacity of the background fill, from `0` (fully transparent) to `1` (fully opaque). Only applies when **Background Color** is set.",
    },
    contentAlignment: {
      propDefinition: [
        googleSlides,
        "contentAlignment",
      ],
      description: "How content sits vertically within each cell.",
    },
  },
  async run({ $ }) {
    const builder = styling.styleBuilder();
    builder.set("contentAlignment", this.contentAlignment);
    builder.set(
      "tableCellBackgroundFill.solidFill",
      styling.solidFill(this.backgroundColor, this.backgroundAlpha, "Background"),
    );

    const {
      style, fields, isEmpty,
    } = builder.result();
    if (isEmpty) {
      throw new ConfigurationError("Set at least one style option (Background Color or Content Alignment) — otherwise there is nothing to update.");
    }

    const request = {
      objectId: this.tableId,
      tableCellProperties: style,
      fields,
    };

    // Omitting `tableRange` applies the style to every cell in the table, which is
    // what a blank row/column pair is asking for.
    const location = styling.buildCellLocation(this.rowIndex, this.columnIndex);
    if (location) {
      request.tableRange = {
        location,
        rowSpan: this.rowSpan ?? 1,
        columnSpan: this.columnSpan ?? 1,
      };
    }

    const response = await this.googleSlides.batchUpdate(this.presentationId, [
      {
        updateTableCellProperties: request,
      },
    ]);

    const scope = request.tableRange
      ? `cells at row ${this.rowIndex}, column ${this.columnIndex}`
      : "all cells";
    $.export("$summary", `Successfully updated ${scope} in table with ID: ${this.tableId}`);
    return response.data;
  },
};
