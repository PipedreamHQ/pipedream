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

    const {
      element, groupId,
    } = await googleSlides.getPageElement(id, objectId);

    // A grouped child's transform is relative to its group, so the slide-space
    // X/Y props would not mean what they say, and the API rejects grouped IDs
    // for z-order outright.
    if (groupId) {
      throw new ConfigurationError(`Page element "${objectId}" is inside group "${groupId}". Its position is relative to that group, and z-order cannot target a grouped element. Target the group itself, or ungroup it first.`);
    }

    if (movesElement) {
      const current = element.transform || {};
      const unit = current.unit || POINTS;
      const toUnit = (points) => (unit === EMU
        ? points * EMU_PER_POINT
        : points);

      // A move alone leaves the matrix untouched. When scale or rotation is
      // set, the matrix is decomposed so that reflection (carried by the signed
      // scaleY) and shear survive the rebuild.
      let matrix = {
        scaleX: current.scaleX ?? 1,
        scaleY: current.scaleY ?? 1,
        shearX: current.shearX ?? 0,
        shearY: current.shearY ?? 0,
      };

      if (scaleXPercent != null || scaleYPercent != null || rotation != null) {
        // Factor any reflection onto the axis that already carries it before
        // decomposing, so changing the rotation cannot move a horizontal flip
        // onto the vertical axis and leave the element 180 degrees out.
        const determinant = (matrix.scaleX * matrix.scaleY) - (matrix.shearY * matrix.shearX);
        const flipX = determinant < 0 && matrix.scaleX < 0
          ? -1
          : 1;
        const flipY = determinant < 0 && flipX === 1
          ? -1
          : 1;

        const columnX = matrix.scaleX * flipX;
        const columnXShear = matrix.shearY * flipX;
        const columnY = matrix.shearX * flipY;
        const columnYScale = matrix.scaleY * flipY;

        const currentAngle = Math.atan2(columnXShear, columnX);
        const cos = Math.cos(currentAngle);
        const sin = Math.sin(currentAngle);

        const currentScaleX = Math.hypot(columnX, columnXShear) || 1;
        const shear = (columnY * cos) + (columnYScale * sin);
        const currentScaleY = (columnYScale * cos) - (columnY * sin);

        const scaleX = scaleXPercent != null
          ? scaleXPercent / 100
          : currentScaleX;
        const scaleY = scaleYPercent != null
          ? (scaleYPercent / 100) * (currentScaleY < 0
            ? -1
            : 1)
          : currentScaleY;
        const angle = rotation != null
          ? rotation * Math.PI / 180
          : currentAngle;

        const newCos = Math.cos(angle);
        const newSin = Math.sin(angle);

        matrix = {
          scaleX: scaleX * newCos * flipX,
          shearY: scaleX * newSin * flipX,
          shearX: ((shear * newCos) - (scaleY * newSin)) * flipY,
          scaleY: ((shear * newSin) + (scaleY * newCos)) * flipY,
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
