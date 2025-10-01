import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-insert-text-into-table",
  name: "Insert Text into Table",
  description: "Insert text into a table cell. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#InsertTextRequest)",
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
      description: "The 0-based table row index of the target cell",
      optional: true,
    },
    columnIndex: {
      type: "integer",
      label: "Column Index",
      description: "The 0-based table column index of the target cell",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to insert",
    },
    insertionIndex: {
      type: "integer",
      label: "Insertion Index",
      description: "The index where the text will be inserted",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.insertText(this.presentationId, {
      objectId: this.tableId,
      cellLocation: {
        rowIndex: this.rowIndex,
        columnIndex: this.columnIndex,
      },
      text: this.text,
      insertionIndex: this.insertionIndex,
    });
    $.export("$summary", "Successfully inserted text into table cell");
    return response.data;
  },
};
