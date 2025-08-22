import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-insert-table-columns",
  name: "Insert Table Columns",
  description: "Insert new columns into a table. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#InsertTableColumnsRequest)",
  version: "0.0.1",
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
    columnIndex: {
      type: "integer",
      label: "Column Index",
      description: "The column index of an existing cell used as the insertion reference point",
      optional: true,
    },
    insertRight: {
      type: "boolean",
      label: "Insert Right",
      description: "Whether to insert the column to the right of the specified cell location",
      optional: true,
    },
    number: {
      type: "integer",
      label: "Number",
      description: "The number of columns to be inserted. Maximum 20 per request.",
      default: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.insertTableColumns(this.presentationId, {
      tableObjectId: this.tableId,
      cellLocation: {
        columnIndex: this.columnIndex,
      },
      insertRight: this.insertRight,
      number: this.number,
    });
    $.export("$summary", "Successfully inserted table column");
    return response.data;
  },
};
