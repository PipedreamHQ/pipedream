import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-resource-transformation",
  name: "Transform Video or Audio",
  description: "Transform a video or audio asset on-the-fly with several options. [See the documentation](https://cloudinary.com/documentation/video_manipulation_and_delivery)",
  version: "0.3.0",
  type: "action",
  props: {
    cloudinary,
        assetId: {
          propDefinition: [
            cloudinary,
            "assetId"
          ]
        },
        width: {
          type: "integer",
          label: "Width",
          description: "The new width of the video, e.g. `854`",
          optional: true,
        },
        height: {
          type: "integer",
          label: "Height",
          description: "The new height of the video, e.g. `480`",
          optional: true,
        },
        duration: {
          type: "integer",
          label: "Duration",
          description: "The duration to set for the video in seconds, e.g. `30`",
          optional: true,
        },
            transformations: {
              propDefinition: [
                cloudinary,
                "transformations"
              ]
            },
  },
  async run({ $ }) {
    const { cloudinary, assetId, transformations, ...options } = this;
    try {
    const response = await cloudinary.transformAsset(assetId, { 
      ...options,
      ...transformations,
    });

    if (response) {
      $.export("$summary", "Successfully transformed video");
    }

    return response;
  } catch (err) {
    throw new Error(`Cloudinary error response: ${err.error?.message ?? JSON.stringify(err)}`);
  }
  },
};
