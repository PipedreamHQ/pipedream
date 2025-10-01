import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-delete-table-row",
  name: "Delete Table Row",
  description: "Delete row from a table. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#DeleteTableRowRequest)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
      description: "The index of the row to delete",
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.deleteTableRow(this.presentationId, {
      tableObjectId: this.tableId,
      cellLocation: {
        rowIndex: this.rowIndex,
      },
    });
    $.export("$summary", "Successfully deleted table row");
    return response.data;
  },
};
