import googleSlides from "../../google_slides.app.mjs";
import { SHAPE_TYPES } from "../../common/constants.mjs";

export default {
  key: "google_slides-create-page-element",
  name: "Create Page Element",
  description: "Create a new page element in a slide. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateShapeRequest)",
  version: "0.0.3",
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
    type: {
      type: "string",
      label: "Type",
      description: "The type of the shape",
      options: SHAPE_TYPES,
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
    scaleX: {
      type: "integer",
      label: "Scale X",
      description: "The scale of the shape on the x-axis",
      default: 1,
      optional: true,
    },
    scaleY: {
      type: "integer",
      label: "Scale Y",
      description: "The scale of the shape on the y-axis",
      default: 1,
      optional: true,
    },
    translateX: {
      type: "integer",
      label: "Translate X",
      description: "The translation of the shape on the x-axis",
      default: 0,
      optional: true,
    },
    translateY: {
      type: "integer",
      label: "Translate Y",
      description: "The translation of the shape on the y-axis",
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleSlides.createShape(this.presentationId, {
      shapeType: this.type,
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
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          translateX: this.translateX,
          translateY: this.translateY,
          unit: "PT",
        },
      },
    });
    $.export("$summary", `Successfully created shape with ID: ${response.data.replies[0].createShape.objectId}`);
    return response.data;
  },
};
