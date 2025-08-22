import googleSlides from "../../google_slides.app.mjs";

export default {
  key: "google_slides-create-image",
  name: "Create Image",
  description: "Creates an image in a slide. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#CreateImageRequest)",
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
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the image to insert",
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
    const response = await this.googleSlides.createImage(this.presentationId, {
      url: this.url,
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
    $.export("$summary", `Successfully created image with ID: ${response.data.replies[0].createImage.objectId}`);
    return response.data;
  },
};
