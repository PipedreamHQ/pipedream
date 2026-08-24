import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import styling from "../../common/styling.mjs";

export default {
  key: "google_slides-update-shape-properties",
  name: "Update Shape Properties",
  description: "Style a shape or text box — fill color and opacity, outline color, weight and dash style, and how its text sits vertically. Only the options you fill in are changed; everything you leave blank keeps its current formatting. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdateShapePropertiesRequest)",
  version: "0.0.1",
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
    shapeId: {
      propDefinition: [
        googleSlides,
        "shapeId",
        (c) => ({
          presentationId: c.presentationId,
          slideId: c.slideId,
        }),
      ],
    },
    backgroundColor: {
      type: "string",
      label: "Fill Color",
      description: "The shape's fill color as a 6-digit hex code (e.g. `#4285F4`).",
      optional: true,
    },
    backgroundAlpha: {
      type: "string",
      label: "Fill Opacity",
      description: "Opacity of the fill, from `0` (fully transparent) to `1` (fully opaque). Only applies when **Fill Color** is set.",
      optional: true,
    },
    outlineColor: {
      type: "string",
      label: "Outline Color",
      description: "The shape's border color as a 6-digit hex code (e.g. `#000000`).",
      optional: true,
    },
    outlineAlpha: {
      type: "string",
      label: "Outline Opacity",
      description: "Opacity of the outline, from `0` (fully transparent) to `1` (fully opaque). Only applies when **Outline Color** is set.",
      optional: true,
    },
    outlineWeight: {
      type: "integer",
      label: "Outline Weight",
      description: "Thickness of the shape's border, in points (e.g. `2`).",
      optional: true,
      min: 0,
    },
    outlineDashStyle: {
      type: "string",
      label: "Outline Dash Style",
      description: "The line style of the shape's border.",
      optional: true,
      options: [
        "SOLID",
        "DOT",
        "DASH",
        "DASH_DOT",
        "LONG_DASH",
        "LONG_DASH_DOT",
      ],
    },
    contentAlignment: {
      type: "string",
      label: "Content Alignment",
      description: "How the shape's text sits vertically within it.",
      optional: true,
      options: [
        "TOP",
        "MIDDLE",
        "BOTTOM",
      ],
    },
  },
  async run({ $ }) {
    const builder = styling.styleBuilder();
    builder.set("contentAlignment", this.contentAlignment);
    builder.set(
      "shapeBackgroundFill.solidFill",
      styling.solidFill(this.backgroundColor, this.backgroundAlpha, "Fill"),
    );
    builder.set(
      "outline.outlineFill.solidFill",
      styling.solidFill(this.outlineColor, this.outlineAlpha, "Outline"),
    );
    builder.set("outline.weight", styling.points(this.outlineWeight));
    builder.set("outline.dashStyle", this.outlineDashStyle);

    const {
      style, fields, isEmpty,
    } = builder.result();
    if (isEmpty) {
      throw new ConfigurationError("Set at least one style option (e.g. Fill Color, Outline Weight, or Content Alignment) — otherwise there is nothing to update.");
    }

    const response = await this.googleSlides.batchUpdate(this.presentationId, [
      {
        updateShapeProperties: {
          objectId: this.shapeId,
          shapeProperties: style,
          fields,
        },
      },
    ]);

    $.export("$summary", `Successfully updated properties of shape with ID: ${this.shapeId}`);
    return response.data;
  },
};
