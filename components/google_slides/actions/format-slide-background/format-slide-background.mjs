import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_slides-format-slide-background",
  name: "Format Slide Background",
  description: "Set the background fill of a single slide in a Google Slides presentation. Use **Get Presentation** to find the slide's object ID. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdatePagePropertiesRequest)",
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
    slideId: {
      propDefinition: [
        googleSlides,
        "staticSlideId",
      ],
    },
    backgroundColor: {
      propDefinition: [
        googleSlides,
        "backgroundColor",
      ],
      description: "Slide background as a hex code (e.g. `#102A43`) or a theme color name (e.g. `DARK1`).",
      optional: false,
    },
  },
  async run({ $ }) {
    const {
      googleSlides,
      presentationId,
      slideId,
      backgroundColor,
    } = this;

    const solidFill = utils.toSolidFill(backgroundColor);
    if (!solidFill) {
      throw new ConfigurationError(`Background Color "${backgroundColor}" is not a valid hex color or theme color name. Use a 6-digit hex code such as \`#102A43\`, or a theme color such as \`DARK1\`.`);
    }

    await googleSlides.batchUpdate(googleSlides.getPresentationId(presentationId), [
      {
        updatePageProperties: {
          objectId: slideId,
          pageProperties: {
            pageBackgroundFill: {
              solidFill,
            },
          },
          fields: "pageBackgroundFill.solidFill.color",
        },
      },
    ]);

    $.export("$summary", `Set background of slide ${slideId}`);

    return {
      presentationId,
      slideId,
      backgroundColor,
    };
  },
};
