import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_slides-format-table-cell",
  name: "Format Table Cell",
  description: "Set the background fill or content alignment of table cells in a Google Slides presentation. Applies to a single cell, or to a block of cells via **Row Span** and **Column Span**. Omit the cell location to format the whole table. Use **Get Presentation** to find the table's object ID. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdateTableCellPropertiesRequest)",
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
        "staticPresentationId",
      ],
    },
    objectId: {
      propDefinition: [
        googleSlides,
        "pageElementId",
      ],
      description: "The object ID of the table to format. Use **Get Presentation** and read `slides[].pageElements[].objectId` for an element with a `table` field.",
    },
    rowIndex: {
      propDefinition: [
        googleSlides,
        "rowIndex",
      ],
      description: "0-based row of the first cell to format. Omit (with **Column Index**) to format every cell in the table.",
    },
    columnIndex: {
      propDefinition: [
        googleSlides,
        "columnIndex",
      ],
      description: "0-based column of the first cell to format. Omit (with **Row Index**) to format every cell in the table.",
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
      propDefinition: [
        googleSlides,
        "backgroundColor",
      ],
      description: "Cell fill as a hex code (e.g. `#EEEEEE`) or a theme color name (e.g. `ACCENT1`).",
    },
    backgroundOpacity: {
      propDefinition: [
        googleSlides,
        "backgroundOpacity",
      ],
      description: "Opacity of the cell fill as a whole percentage, from `0` (fully transparent) to `100` (fully opaque). Can be set on its own to change an existing fill's opacity without restating its color.",
    },
    contentAlignment: {
      propDefinition: [
        googleSlides,
        "contentAlignment",
      ],
    },
  },
  async run({ $ }) {
    const {
      googleSlides,
      presentationId,
      objectId,
      rowIndex,
      columnIndex,
      rowSpan,
      columnSpan,
      backgroundColor,
      backgroundOpacity,
      contentAlignment,
    } = this;

    const tableCellProperties = {};
    const fields = [];

    if (backgroundColor || backgroundOpacity != null) {
      const solidFill = utils.toSolidFill(backgroundColor, backgroundOpacity);
      if (!solidFill) {
        throw new ConfigurationError(`Background Color "${backgroundColor}" is not a valid hex color or theme color name. Use a 6-digit hex code such as \`#EEEEEE\`, or a theme color such as \`ACCENT1\`.`);
      }
      tableCellProperties.tableCellBackgroundFill = {
        solidFill,
      };
      // Colour and opacity are masked separately so either can be set alone.
      if (solidFill.color) {
        fields.push("tableCellBackgroundFill.solidFill.color");
      }
      if (solidFill.alpha != null) {
        fields.push("tableCellBackgroundFill.solidFill.alpha");
      }
    }
    if (contentAlignment) {
      tableCellProperties.contentAlignment = contentAlignment;
      fields.push("contentAlignment");
    }

    if (!fields.length) {
      throw new ConfigurationError("Provide at least one formatting option (Background Color, Background Opacity, or Content Alignment).");
    }
    if ((rowIndex == null) !== (columnIndex == null)) {
      throw new ConfigurationError("Row Index and Column Index must be provided together.");
    }
    if (rowIndex == null && (rowSpan != null || columnSpan != null)) {
      throw new ConfigurationError("Row Span and Column Span need a starting cell. Provide Row Index and Column Index, or omit all four to format the whole table.");
    }

    // Omitting tableRange entirely is what the API treats as "every cell".
    const tableRange = rowIndex == null
      ? {}
      : {
        tableRange: {
          location: {
            rowIndex,
            columnIndex,
          },
          rowSpan: rowSpan ?? 1,
          columnSpan: columnSpan ?? 1,
        },
      };

    await googleSlides.batchUpdate(googleSlides.getPresentationId(presentationId), [
      {
        updateTableCellProperties: {
          objectId,
          tableCellProperties,
          fields: fields.join(","),
          ...tableRange,
        },
      },
    ]);

    $.export("$summary", `Formatted table cells on ${objectId}`);

    return {
      presentationId,
      objectId,
      fieldsUpdated: fields,
      ...tableRange,
    };
  },
};
