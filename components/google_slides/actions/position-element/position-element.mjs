import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import {
  EMU, EMU_PER_POINT, POINTS, Z_ORDER_OPERATIONS,
} from "../../common/constants.mjs";

export default {
  key: "google_slides-position-element",
  name: "Position Element",
  description: "Move, scale, rotate, or restack a page element in a Google Slides presentation. Unspecified properties keep their current values. Use **Get Presentation** to find the element's object ID. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdatePageElementTransformRequest)",
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
    },
    translateX: {
      type: "integer",
      label: "X Position",
      description: "Horizontal position in points, measured from the top-left of the slide.",
      optional: true,
    },
    translateY: {
      type: "integer",
      label: "Y Position",
      description: "Vertical position in points, measured from the top-left of the slide.",
      optional: true,
    },
    scaleXPercent: {
      type: "integer",
      label: "Horizontal Scale",
      description: "Horizontal scale as a percentage of the element's intrinsic size (100 = unscaled). Range 1-1000.",
      min: 1,
      max: 1000,
      optional: true,
    },
    scaleYPercent: {
      type: "integer",
      label: "Vertical Scale",
      description: "Vertical scale as a percentage of the element's intrinsic size (100 = unscaled). Range 1-1000.",
      min: 1,
      max: 1000,
      optional: true,
    },
    rotation: {
      type: "integer",
      label: "Rotation",
      description: "Clockwise rotation in degrees (-360 to 360).",
      min: -360,
      max: 360,
      optional: true,
    },
    zOrderOperation: {
      type: "string",
      label: "Z-Order",
      description: "Restack the element relative to the other elements on its slide.",
      options: Z_ORDER_OPERATIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleSlides,
      presentationId,
      objectId,
      translateX,
      translateY,
      scaleXPercent,
      scaleYPercent,
      rotation,
      zOrderOperation,
    } = this;

    const movesElement = [
      translateX,
      translateY,
      scaleXPercent,
      scaleYPercent,
      rotation,
    ].some((value) => value != null);

    if (!movesElement && !zOrderOperation) {
      throw new ConfigurationError("Provide at least one of X Position, Y Position, Horizontal Scale, Vertical Scale, Rotation, or Z-Order.");
    }

    const id = googleSlides.getPresentationId(presentationId);
    const requests = [];

    if (movesElement) {
      const { element } = await googleSlides.getPageElement(id, objectId);
      const current = element.transform || {};
      const unit = current.unit || POINTS;
      const toUnit = (points) => (unit === EMU
        ? points * EMU_PER_POINT
        : points);

      // A move alone must leave the matrix untouched: decomposing and
      // recomposing it would drop a negative scale (a flip) and any shear.
      let matrix = {
        scaleX: current.scaleX ?? 1,
        scaleY: current.scaleY ?? 1,
        shearX: current.shearX ?? 0,
        shearY: current.shearY ?? 0,
      };

      if (scaleXPercent != null || scaleYPercent != null || rotation != null) {
        const currentScaleX = Math.hypot(current.scaleX ?? 1, current.shearY ?? 0) || 1;
        const currentScaleY = Math.hypot(current.scaleY ?? 1, current.shearX ?? 0) || 1;
        const currentRotation = Math.atan2(current.shearY ?? 0, current.scaleX ?? 1);

        const scaleX = scaleXPercent != null
          ? scaleXPercent / 100
          : currentScaleX;
        const scaleY = scaleYPercent != null
          ? scaleYPercent / 100
          : currentScaleY;
        const angle = rotation != null
          ? rotation * Math.PI / 180
          : currentRotation;

        matrix = {
          scaleX: scaleX * Math.cos(angle),
          shearX: -scaleY * Math.sin(angle),
          shearY: scaleX * Math.sin(angle),
          scaleY: scaleY * Math.cos(angle),
        };
      }

      requests.push({
        updatePageElementTransform: {
          objectId,
          applyMode: "ABSOLUTE",
          transform: {
            ...matrix,
            translateX: translateX != null
              ? toUnit(translateX)
              : current.translateX ?? 0,
            translateY: translateY != null
              ? toUnit(translateY)
              : current.translateY ?? 0,
            unit,
          },
        },
      });
    }

    if (zOrderOperation) {
      requests.push({
        updatePageElementsZOrder: {
          pageElementObjectIds: [
            objectId,
          ],
          operation: zOrderOperation,
        },
      });
    }

    await googleSlides.batchUpdate(id, requests);

    $.export("$summary", `Repositioned element ${objectId}`);

    return {
      presentationId,
      objectId,
      requestsApplied: requests.map((request) => Object.keys(request)[0]),
    };
  },
};
