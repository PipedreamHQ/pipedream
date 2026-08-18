import constants from "../../common/constants.mjs";
import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-upload-image-from-url",
  name: "Upload Image From URL",
  description: "Fetch a public direct image URL and store it permanently in TokPortal storage."
    + " Use the returned `storage_path` as a carousel image in **Configure Video** or as the profile picture of a bundle account."
    + " [See the documentation](https://developers.tokportal.com/media-upload/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    tokportal,
    bundleId: {
      propDefinition: [
        tokportal,
        "bundleId",
      ],
      description: "Bundle the image belongs to. Use **List Bundles** to find bundle IDs.",
    },
    url: {
      type: "string",
      label: "Image URL",
      description: "Public direct image URL (JPEG, PNG, WebP or GIF), e.g. `https://example.com/slide-1.jpg`.",
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "What the image is used for: `carousel` (slide) or `profile_picture`.",
      options: constants.IMAGE_PURPOSE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tokportal.uploadImageFromUrl({
      $,
      data: {
        bundle_id: this.bundleId,
        url: this.url,
        purpose: this.purpose,
      },
    });
    const data = response?.data ?? response;
    const storedUrl = data?.storage_path ?? data?.public_url;
    $.export("$summary", `Imported image into bundle ${this.bundleId}${storedUrl
      ? ` (${storedUrl})`
      : ""}`);
    return data;
  },
};
