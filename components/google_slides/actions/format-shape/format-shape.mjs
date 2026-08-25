import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import utils from "../../common/utils.mjs";
import {
  DASH_STYLES, POINTS,
} from "../../common/constants.mjs";

export default {
  key: "google_slides-format-shape",
  name: "Format Shape",
  description: "Set the background fill, outline, content alignment, or link of a shape in a Google Slides presentation. Use **Get Presentation** to find the shape's object ID. Shadow is not settable. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdateShapePropertiesRequest)",
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
        "staticPresentationId",
      ],
    },
    objectId: {
      propDefinition: [
        googleSlides,
        "pageElementId",
      ],
      description: "The object ID of the shape to format. Use **Get Presentation** and read `slides[].pageElements[].objectId`.",
    },
    backgroundColor: {
      propDefinition: [
        googleSlides,
        "backgroundColor",
      ],
      description: "Fill color as a hex code (e.g. `#FF0000`) or a theme color name (e.g. `ACCENT1`).",
    },
    backgroundOpacity: {
      propDefinition: [
        googleSlides,
        "backgroundOpacity",
      ],
      description: "Opacity of the fill as a whole percentage, from `0` (fully transparent) to `100` (fully opaque). Can be set on its own to change an existing fill's opacity without restating its color.",
    },
    outlineColor: {
      type: "string",
      label: "Outline Color",
      description: "Outline color as a hex code or a theme color name.",
      optional: true,
    },
    outlineOpacity: {
      type: "integer",
      label: "Outline Opacity",
      description: "Opacity of the outline as a whole percentage, from `0` (fully transparent) to `100` (fully opaque).",
      min: 0,
      max: 100,
      optional: true,
    },
    outlineWeight: {
      type: "integer",
      label: "Outline Weight",
      description: "Outline thickness in points (1-100).",
      min: 1,
      max: 100,
      optional: true,
    },
    outlineDashStyle: {
      type: "string",
      label: "Outline Dash Style",
      description: "Dash pattern for the outline.",
      options: DASH_STYLES,
      optional: true,
    },
    contentAlignment: {
      propDefinition: [
        googleSlides,
        "contentAlignment",
      ],
      description: "Vertical alignment of the text inside the shape.",
    },
    link: {
      type: "string",
      label: "Link URL",
      description: "Make the shape link to this URL.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleSlides,
      presentationId,
      objectId,
      backgroundColor,
      backgroundOpacity,
      outlineColor,
      outlineOpacity,
      outlineWeight,
      outlineDashStyle,
      contentAlignment,
      link,
    } = this;

    const shapeProperties = {};
    const fields = [];

    // Colour and opacity are independent: a mask can scope to `...solidFill.alpha`,
    // so either can be set without disturbing the other.
    const buildFill = (color, opacityPercent, label, maskPrefix) => {
      if (!color && opacityPercent == null) {
        return null;
      }
      const solidFill = utils.toSolidFill(color, opacityPercent);
      if (!solidFill) {
        throw new ConfigurationError(`${label} "${color}" is not a valid hex color or theme color name. Use a 6-digit hex code such as \`#FF0000\`, or a theme color such as \`ACCENT1\`.`);
      }
      if (solidFill.color) {
        fields.push(`${maskPrefix}.color`);
      }
      if (solidFill.alpha != null) {
        fields.push(`${maskPrefix}.alpha`);
      }
      return solidFill;
    };

    const backgroundFill = buildFill(
      backgroundColor, backgroundOpacity, "Background Color", "shapeBackgroundFill.solidFill",
    );
    if (backgroundFill) {
      shapeProperties.shapeBackgroundFill = {
        solidFill: backgroundFill,
      };
    }

    const outlineFill = buildFill(
      outlineColor, outlineOpacity, "Outline Color", "outline.outlineFill.solidFill",
    );
    if (outlineFill || outlineWeight != null || outlineDashStyle) {
      shapeProperties.outline = {};
      if (outlineFill) {
        shapeProperties.outline.outlineFill = {
          solidFill: outlineFill,
        };
      }
      if (outlineWeight != null) {
        shapeProperties.outline.weight = {
          magnitude: outlineWeight,
          unit: POINTS,
        };
        fields.push("outline.weight");
      }
      if (outlineDashStyle) {
        shapeProperties.outline.dashStyle = outlineDashStyle;
        fields.push("outline.dashStyle");
      }
    }

    if (contentAlignment) {
      shapeProperties.contentAlignment = contentAlignment;
      fields.push("contentAlignment");
    }

    if (link) {
      shapeProperties.link = {
        url: link,
      };
      fields.push("link");
    }

    if (!fields.length) {
      throw new ConfigurationError("Provide at least one formatting option (for example Background Color, Background Opacity, Outline Color, or Content Alignment).");
    }

    await googleSlides.batchUpdate(googleSlides.getPresentationId(presentationId), [
      {
        updateShapeProperties: {
          objectId,
          shapeProperties,
          fields: fields.join(","),
        },
      },
    ]);

    $.export("$summary", `Formatted shape ${objectId}`);

    return {
      presentationId,
      objectId,
      fieldsUpdated: fields,
    };
  },
};
