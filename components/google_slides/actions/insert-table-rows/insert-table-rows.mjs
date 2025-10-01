import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-insert-table-rows",
  name: "Insert Table Rows",
  description: "Insert new rows into a table. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#InsertTableRowsRequest)",
  version: "0.0.2",
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
      type: "integer",
      label: "Row Index",
      description: "The row index of an existing cell used as the insertion reference point",
      optional: true,
    },
    insertBelow: {
      type: "boolean",
      label: "Insert Below",
      description: "Whether to insert the row below the specified cell location",
      optional: true,
    },
    number: {
      type: "integer",
      label: "Number",
      description: "The number of rows to be inserted. Maximum 20 per request.",
      default: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.insertTableRows(this.presentationId, {
      tableObjectId: this.tableId,
      cellLocation: {
        rowIndex: this.rowIndex,
      },
      insertBelow: this.insertBelow,
      number: this.number,
    });
    $.export("$summary", "Successfully inserted table row");
    return response.data;
  },
};
