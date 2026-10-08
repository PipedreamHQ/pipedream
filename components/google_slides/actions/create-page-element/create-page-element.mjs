import googleSlides from "../../google_slides.app.mjs";
import { SHAPE_TYPES } from "../../common/constants.mjs";

export default {
  key: "google_slides-create-page-element",
  name: "Create Page Element",
  description: "Create a shape or text box on a slide. Size and position are in points (1/72 of an inch), measured from the top-left of the slide; a default 16:9 slide is 720 x 405 points, so an element placed outside that area is not visible. To add a title or body text, prefer **Create Slide With Content**, which fills a layout's placeholders instead of positioning boxes by hand. Returns the new element's object ID in `replies[0].createShape.objectId`, for use with **Insert Text**. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateShapeRequest)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "The type of the shape. Use `TEXT_BOX` for a plain box of text.",
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
      description: "Horizontal scale multiplier applied to the width (`1` = unscaled).",
      default: 1,
      optional: true,
    },
    scaleY: {
      type: "integer",
      label: "Scale Y",
      description: "Vertical scale multiplier applied to the height (`1` = unscaled).",
      default: 1,
      optional: true,
    },
    translateX: {
      type: "integer",
      label: "Translate X",
      description: "Horizontal position in points, measured from the top-left of the slide (e.g. `36` for a half-inch margin). A default 16:9 slide is 720 points wide.",
      default: 0,
      optional: true,
    },
    translateY: {
      type: "integer",
      label: "Translate Y",
      description: "Vertical position in points, measured from the top-left of the slide (e.g. `36` for a half-inch margin). A default 16:9 slide is 405 points tall.",
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
