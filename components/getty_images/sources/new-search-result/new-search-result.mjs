import gettyImages from "../../getty_images.app.mjs";
import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "getty_images-new-search-result",
  name: "New Search Result",
  description: "Emit new event for each image returned by a search query that has not been seen in a previous run. Polls on a schedule to detect newly available images matching your criteria. [See the documentation](https://developers.gettyimages.com/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
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
    pageSize: {
      propDefinition: [
        gettyImages,
        "pageSize",
      ],
    },
  },
  methods: {
    ...base.methods,
    generateMeta(image) {
      return {
        id: image.id,
        summary: image.title
          ? `${image.title} (${image.id})`
          : `Image ${image.id}`,
        ts: image.date_created
          ? Date.parse(image.date_created)
          : Date.now(),
      };
    },
    async emitEvent(maxResults) {
      const response = await this.gettyImages.searchImages({
        phrase: this.phrase,
        imageType: this.imageType,
        orientation: this.orientation,
        licenseModel: this.licenseModel,
        sortOrder: "newest",
        pageSize: maxResults ?? this.pageSize ?? 30,
        fields: [
          "summary_set",
        ],
      });

      const images = response?.images ?? [];
      for (const image of images) {
        this.$emit(image, this.generateMeta(image));
      }
    },
  },
  sampleEmit,
};
