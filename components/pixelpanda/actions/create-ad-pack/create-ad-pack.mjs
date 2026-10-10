import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-create-ad-pack",
  name: "Create Ad Pack From Product URL",
  description: "Product page URL in — 6 scene photos, a lip-synced UGC video, 8 static ads and captions out (59 credits with video, 9 without). Poll with **Get Ad Pack**. [See the documentation](https://pixelpanda.ai/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pixelpanda,
    productUrl: {
      type: "string",
      label: "Product Page URL",
      description: "Shopify, WooCommerce, Amazon or any product page with images",
    },
    includeVideo: {
      type: "boolean",
      label: "Include UGC Video",
      description: "Also generate a lip-synced UGC video (50 credits)",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.createAdPack({
      $,
      data: {
        url: this.productUrl,
        include_images: true,
        include_ads: true,
        include_captions: true,
        include_animations: false,
        include_video: this.includeVideo ?? true,
      },
    });

    $.export("$summary", `Successfully started ad pack job${response.job_id
      ? ` with ID ${response.job_id}`
      : ""}`);

    return response;
  },
};
