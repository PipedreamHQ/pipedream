import { ConfigurationError } from "@pipedream/platform";
import htmlCssToImageApp from "../../html_css_to_image.app.mjs";

export default {
  key: "html_css_to_image-delete-image",
  name: "Delete Image",
  description: "Permanently delete one image and clear its cached copies. This cannot be undone. Requires an API key with images:delete permission. Use the image id returned by **Create Image From HTML**, **Create Image From URL**, or **Create Image From Template**. A generated signed URL alone does not provide an image ID. [See the documentation](https://docs.htmlcsstoimage.com/getting-started/using-the-api/#deleting-an-image)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    htmlCssToImageApp,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "ID of the image to permanently delete, e.g. `c7db3b3c-59b3-4c13-987b-4ea8217899cf`. Use the `id` returned by **Create Image From HTML**, **Create Image From URL**, or **Create Image From Template**. Supply the ID, not the image URL.",
    },
  },
  async run({ $ }) {
    if (typeof this.imageId !== "string" || !this.imageId.trim()) {
      throw new ConfigurationError("Image ID is required.");
    }
    const imageId = this.imageId.trim();
    await this.htmlCssToImageApp.deleteImage($, imageId);
    $.export("$summary", `Deletion accepted for image ${imageId}`);
    return {
      success: true,
      id: imageId,
    };
  },
};
