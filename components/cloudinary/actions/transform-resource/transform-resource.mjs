import { ConfigurationError } from "@pipedream/platform";
import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-transform-resource",
  name: "Transform Resource",
  description: "Transform an image, video or audio asset on-the-fly with several options. [See the documentation](https://cloudinary.com/documentation/video_manipulation_and_delivery)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudinary,
    assetId: {
      propDefinition: [
        cloudinary,
        "assetId",
      ],
    },
    info: {
      type: "alert",
      alertType: "info",
      content: `You can either select a pre-configured transformation or pass a transformation string. Both can be managed in the [Cloudinary Transformation Builder](https://tx.cloudinary.com/).
\\
If both are specified, the transformation string will be ignored.`,
    },
    namedTransformation: {
      propDefinition: [
        cloudinary,
        "namedTransformation",
      ],
    },
    transformationString: {
      propDefinition: [
        cloudinary,
        "transformationString",
      ],
    },
  },
  async run({ $ }) {
    const {
      cloudinary, assetId, namedTransformation, transformationString,
    } = this;

    if (!namedTransformation && !transformationString) {
      throw new ConfigurationError("Either `Named Transformation` or `Transformation String` are required");
    }

    try {
      const response = await cloudinary.transformAsset(assetId, namedTransformation
        ? {
          transformation: namedTransformation,
        }
        : {
          raw_transformation: transformationString,
        });

      if (response) {
        $.export("$summary", "Successfully transformed resource");
      }

      return response;
    } catch (err) {
      throw new Error(`Cloudinary error response: ${err.error?.message ?? JSON.stringify(err)}`);
    }
  },
};
