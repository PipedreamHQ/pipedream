import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-insert-text",
  name: "Insert Text",
  description: "Insert text into a shape. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#InsertTextRequest)",
  version: "0.0.2",
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
    shapeId: {
      propDefinition: [
        googleSlides,
        "shapeId",
        (c) => ({
          presentationId: c.presentationId,
          slideId: c.slideId,
          textOnly: true,
        }),
      ],
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
      objectId: this.shapeId,
      text: this.text,
      insertionIndex: this.insertionIndex,
    });
    $.export("$summary", `Successfully inserted text into shape with ID: ${this.shapeId}`);
    return response.data;
  },
};
