import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import gettyImages from "../../getty_images.app.mjs";

export default {
  key: "getty_images-new-search-result",
  name: "New Search Result",
  description: "Emit new event for each image returned by a search query that has not been seen in a previous run. Polls on a schedule to detect newly available images matching your criteria. [See the documentation](https://developers.gettyimages.com/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gettyImages,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
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
  },
  async run() {
    const response = await this.gettyImages.searchImages({
      phrase: this.phrase,
      imageType: this.imageType,
      orientation: this.orientation,
      licenseModel: this.licenseModel,
      sortOrder: "newest",
      pageSize: this.pageSize ?? 30,
      fields: [
        "summary_set",
      ],
    });

    const images = response?.images ?? [];
    for (const image of images) {
      this.$emit(image, this.generateMeta(image));
    }
  },
};
