import gettyImages from "../../getty_images.app.mjs";

export default {
  key: "getty_images-download-image",
  name: "Download Image",
  description: "Download a licensed Getty Images asset by image ID. Returns a URI valid for up to 24 hours that can be used to download the file. Requires an active product subscription — use the **Search Images** action with Include Download Sizes enabled to confirm the asset is downloadable under your account. [See the documentation](https://developers.gettyimages.com/docs/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gettyImages,
    imageId: {
      propDefinition: [
        gettyImages,
        "imageId",
      ],
    },
    productType: {
      propDefinition: [
        gettyImages,
        "productType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gettyImages.downloadImage({
      $,
      imageId: this.imageId,
      productId: this.productType,
    });

    $.export("$summary", `Successfully retrieved download URI for image ${this.imageId}`);
    return response;
  },
};
