import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-delete-table-column",
  name: "Delete Table Column",
  description: "Delete column from a table. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#DeleteTableColumnRequest)",
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
      description: "The index of the column to delete",
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.deleteTableColumn(this.presentationId, {
      tableObjectId: this.tableId,
      cellLocation: {
        columnIndex: this.columnIndex,
      },
    });
    $.export("$summary", "Successfully deleted table column");
    return response.data;
  },
};
