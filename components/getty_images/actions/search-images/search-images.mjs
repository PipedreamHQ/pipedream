import gettyImages from "../../getty_images.app.mjs";

export default {
  key: "getty_images-search-images",
  name: "Search Images",
  description: "Search the Getty Images library by keyword with optional filters for image type, orientation, and license model. Returns image metadata including IDs, titles, captions, and display URLs. [See the documentation](https://developers.gettyimages.com/docs/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gettyImages,
    phrase: {
      propDefinition: [
        gettyImages,
        "phrase",
      ],
    },
    imageType: {
      propDefinition: [
        gettyImages,
        "imageType",
      ],
    },
    orientation: {
      propDefinition: [
        gettyImages,
        "orientation",
      ],
    },
    licenseModel: {
      propDefinition: [
        gettyImages,
        "licenseModel",
      ],
    },
    sortOrder: {
      propDefinition: [
        gettyImages,
        "sortOrder",
      ],
    },
    pageSize: {
      propDefinition: [
        gettyImages,
        "pageSize",
      ],
    },
    includeDownloadSizes: {
      type: "boolean",
      label: "Include Download Sizes",
      description: "Include `largest_downloads` in each result. Required to obtain product types for the **Download Image** action. Requires a valid OAuth access token with download permissions.",
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = this.includeDownloadSizes
      ? [
        "summary_set",
        "largest_downloads",
      ]
      : [
        "summary_set",
      ];

    const response = await this.gettyImages.searchImages({
      $,
      imageType: this.imageType,
      phrase: this.phrase,
      orientation: this.orientation,
      licenseModel: this.licenseModel,
      sortOrder: this.sortOrder,
      pageSize: this.pageSize,
      fields,
    });
    const count = response?.result_count ?? 0;
    $.export("$summary", `Found ${count} image${count === 1
      ? ""
      : "s"} for "${this.phrase}"`);
    return response;
  },
};
