import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-create-table",
  name: "Create Table",
  description: "Create a new table in a slide. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateTableRequest)",
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
    rows: {
      type: "integer",
      label: "Rows",
      description: "The number of rows in the table",
    },
    columns: {
      type: "integer",
      label: "Columns",
      description: "The number of columns in the table",
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the shape in points (1/72 of an inch)",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the shape in points (1/72 of an inch)",
    },
    translateX: {
      type: "integer",
      label: "Translate X",
      description: "The translation of the table on the x-axis",
      optional: true,
    },
    translateY: {
      type: "integer",
      label: "Translate Y",
      description: "The translation of the table on the y-axis",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.createTable(this.presentationId, {
      elementProperties: {
        pageObjectId: this.slideId,
        size: {
          height: {
            magnitude: this.height,
            unit: "PT",
          },
          width: {
            magnitude: this.width,
            unit: "PT",
          },
        },
        transform: {
          scaleX: 1,
          scaleY: 1,
          translateX: this.translateX,
          translateY: this.translateY,
          unit: "PT",
        },
      },
      rows: this.rows,
      columns: this.columns,
    });

    $.export("$summary", "Successfully created table in the slide");
    return response.data;
  },
};
